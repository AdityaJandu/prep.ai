import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMeetingsFilters } from "../../hooks/use-meetings-filter";
import { CommandSelect } from "@/components/self/command-select";
import { GeneratedAvatar } from "@/components/self/generated-avatar";


export const AgentIdFilter = () => {
    const trpc = useTRPC();

    const [filters, setFilters] = useMeetingsFilters();

    const [agentSearch, setAgentSearch] = useState("");

    const { data } = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        }),
    );

    return (
        <CommandSelect
            placeholder="Agents"
            options={
                (data?.items ?? []).map((agent) => ({
                    id: agent.id,
                    value: agent.id,
                    children: (
                        <div className="flex items-center gap-x-4">
                            <GeneratedAvatar
                                seed={agent.name}
                                variant="botttsNeutral"
                                className="size-4"
                            />
                            <h5 className="text-[12px]">{agent.name}</h5>
                        </div>
                    ),
                }),
                )
            }
            onSelect={(value) => { setFilters({ agentId: value }) }}
            value={filters.agentId ?? ""}
            onSearch={setAgentSearch}
        />
    );
};