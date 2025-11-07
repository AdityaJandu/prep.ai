import { useTRPC } from "@/trpc/client";
import { MeetingGetOne } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { meetingsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { CommandSelect } from "@/components/self/command-select";
import { GeneratedAvatar } from "@/components/self/generated-avatar";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { LoadingState } from "@/components/self/loading-state";

interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
}


export const MeetingForm = ({ onSuccess, onCancel, initialValues }: MeetingFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

    const [agentSearch, setAgentSearch] = useState("");

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        }),
    );

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );

                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }),
    );

    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );

                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({ id: initialValues?.id }),
                    );
                }

                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }),
    );

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            agentId: initialValues?.agentId ?? ""
        },
    });

    const isEdit = !!initialValues?.id;
    const isCreatePending = createMeeting.isPending;
    const isUpdatePending = updateMeeting.isPending;

    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            updateMeeting.mutate({
                ...values, id: initialValues.id
            });
        } else {
            createMeeting.mutate(values);
        }
    };

    if (isCreatePending) {
        return (
            <LoadingState
                title="Adding meeting"
                descr="Please wait while we add your meeting"
            />
        );
    };

    if (isUpdatePending) {
        return (
            <LoadingState
                title="Updating meeting"
                descr="Please wait while we update your meeting"
            />
        );
    };


    return (
        <>
            <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <FormControl>
                                    <Input id="name" placeholder="e.g. Let's discuss DSA" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="agentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="name">Agent</FormLabel>
                                <FormControl>
                                    <CommandSelect options={
                                        (agents.data?.items ?? [])
                                            .map((agent) => {
                                                return (
                                                    {
                                                        id: agent.id,
                                                        value: agent.id,
                                                        children: (
                                                            <div className="flex items-center gap-x-2">
                                                                <GeneratedAvatar
                                                                    seed={agent.name}
                                                                    variant="botttsNeutral"
                                                                />
                                                                <span>{agent.name}</span>
                                                            </div>
                                                        ),
                                                    }
                                                )
                                            })}
                                        onSelect={field.onChange}
                                        onSearch={setAgentSearch}
                                        value={field.value}
                                        placeholder="Select an agent"
                                    >

                                    </CommandSelect>
                                </FormControl>
                                <FormDescription className="py-1 text-xs">
                                    Not found what you're looking for? {" "}
                                    <button
                                        type="button"
                                        className="text-primary hover:underline font-semibold"
                                        onClick={() => setOpenNewAgentDialog(true)}
                                    >
                                        Create a new agent
                                    </button>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )
                        }
                    />

                    < div className="grid grid-cols-2 gap-x-4" >
                        {onCancel && (
                            <Button variant="ghost" onClick={() => onCancel()} type="button" className="border">
                                Cancel
                            </Button>
                        )}

                        <Button type="submit" className="border">
                            {isEdit ? "Update" : "Create"}
                        </Button>
                    </div >
                </form >
            </Form >
        </>
    )
}

