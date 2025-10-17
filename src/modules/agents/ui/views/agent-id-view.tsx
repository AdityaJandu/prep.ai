"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/self/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

interface AgentIdViewProps {
    agentId: string;
};

export const AgentIdView = ({ agentId }: AgentIdViewProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

    const { data, isPending } = useSuspenseQuery(
        trpc.agents.getOne.queryOptions({
            id: agentId
        })
    );

    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                // INVALIDATE FREE TIER USAGE:
                router.push("/agents");
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }),
    );

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are your sure?",
        `The following action will remove ${data.meetingCount} associated meetings`
    );

    const handleRemoveAgent = async () => {
        const ok = await confirmRemove();

        if (!ok) return;

        removeAgent.mutate({ id: agentId });
    };



    return (
        <>
            <RemoveConfirmation />
            <UpdateAgentDialog
                open={updateAgentDialogOpen}
                onOpenChange={setUpdateAgentDialogOpen}
                initialValues={data}
            />
            <div className="flex-1 px-4 py-4 md:px-8 flex flex-col gap-y-4">
                <AgentIdViewHeader
                    agentId={agentId}
                    agentName={data.name}
                    onEdit={() => setUpdateAgentDialogOpen(true)}
                    onRemove={handleRemoveAgent}
                />

                <div className="bg-white rounded-lg border">
                    <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                        <div className="flex items-center gap-x-3">
                            <GeneratedAvatar
                                seed={data.name}
                                variant="botttsNeutral"
                                className="size-18"
                            />
                            <h2 className="text-2xl font-medium">{data.name}</h2>
                        </div>


                        <Badge variant="outline" className="flex rounded-2xl px-2 py-1 items-center gap-x-2 [&>svg]:size-4">
                            <VideoIcon className="text-blue-600" />
                            <h6 className="text-xs">{data.meetingCount} {data.meetingCount === 1 ? "meeting" : "meetings"}</h6>
                        </Badge>

                        <div className="flex flex-col gap-y-2">
                            <h4 className="text-lg font-medium">Instructions:</h4>
                            <p className="text-sm font-medium">{data.instruction}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export const AgentIdViewLoading = () => {
    return (
        <LoadingState
            title="Loading the agent"
            descr="This may take from a few seconds to a few minutes."
        />
    );
};

export const AgentIdViewError = () => {
    return (
        <ErrorState
            title="Failed to load agent"
            descr="Something went wrong while fetching agents. Try to refresh page."
        />
    );
};
