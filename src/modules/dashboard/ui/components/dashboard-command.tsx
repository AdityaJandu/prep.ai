import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
    CommandResponsiveDialog,
    CommandInput,
    CommandItem,
    CommandList,
    CommandGroup,
    CommandEmpty,
} from '@/components/ui/command';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTRPC } from '@/trpc/client';
import { GeneratedAvatar } from '@/components/self/generated-avatar';

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const trpc = useTRPC();

    const meetings = useQuery(trpc.meetings.getMany.queryOptions({ search, pageSize: 100 }));
    const agents = useQuery(trpc.agents.getMany.queryOptions({ search, pageSize: 100 }));

    return (
        <CommandResponsiveDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
            <CommandInput
                placeholder="Find a meeting or agent"
                value={search}
                onValueChange={(value) => setSearch(value)}
            />

            <CommandList>
                <CommandGroup heading="Meetings">
                    {meetings.data?.items?.length ? (
                        meetings.data.items.map((meeting) => (
                            <CommandItem
                                key={meeting.id}
                                onSelect={() => {
                                    router.push(`/meetings/${meeting.id}`);
                                    setOpen(false);
                                }}
                            >
                                {meeting.name}
                            </CommandItem>
                        ))
                    ) : (
                        <CommandEmpty>
                            <span className="text-muted-foreground text-sm">
                                No meetings found
                            </span>
                        </CommandEmpty>
                    )}
                </CommandGroup>

                <CommandGroup heading="Agents">
                    {agents.data?.items?.length ? (
                        agents.data.items.map((agent) => (
                            <CommandItem
                                key={agent.id}
                                onSelect={() => {
                                    router.push(`/agents/${agent.id}`);
                                    setOpen(false);
                                }}
                            >
                                <GeneratedAvatar
                                    seed={agent.name}
                                    variant="botttsNeutral"
                                    className="size-5 mr-2"
                                />
                                {agent.name}
                            </CommandItem>
                        ))
                    ) : (
                        <CommandEmpty>
                            <span className="text-muted-foreground text-sm">
                                No agents found
                            </span>
                        </CommandEmpty>
                    )}
                </CommandGroup>
            </CommandList>
        </CommandResponsiveDialog>
    );
};
