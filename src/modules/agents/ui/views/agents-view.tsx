"use client";

import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ResponsiveDialog } from "@/components/self/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/self/empty-state";
import { useAgentFilters } from "../../hooks/use-agents-filter";
import { DataPagination } from "../components/data-pagination";



export const AgentsView = () => {
    const [filters, setFilters] = useAgentFilters();
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters
    }));

    if (data.items.length === 0) {
        return (
            <EmptyState
                title="Create your first agent"
                descr="Create an agent to join in meetings. Each agent will follow your instruction and can participate in discussion during calls."
            />
        );
    };

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable columns={columns} data={data.items} />
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => { setFilters({ page }) }}
            />
        </div>
    );
};

export const AgentsViewLoading = () => {
    return (
        <LoadingState
            title="Loading agents"
            descr="This may take from a few seconds to a few minutes."
        />
    );
};

export const AgentsViewError = () => {
    return (
        <ErrorState
            title="Failed to load agents"
            descr="Something went wrong while fetching agents. Try to refresh page."
        />
    );
};