"use client";

import { EmptyState } from "@/components/self/empty-state";
import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/self/data-table";
import { columns } from "../components/columns";
import { useRouter } from "next/navigation";
import { useMeetingsFilters } from "../../hooks/use-meetings-filter";
import { DataPagination } from "@/components/self/data-pagination";


export const MeetingView = () => {
    const router = useRouter();

    const [filters, setFilters] = useMeetingsFilters();

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filters
    }));

    if (data.items.length === 0) {
        return (
            <EmptyState
                title="Create your first meeting"
                descr="Create a meeting to join in with agent. Each meeting will have an agent that follows your instruction and can participate in discussion during meetings."
            />
        );
    };


    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable
                columns={columns}
                data={data.items}
                onRowClick={(row) => router.push(`/meetings/${row.id}`)}
            />
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => { setFilters({ page }) }}
            />
        </div>
    )
}

export const MeetingViewLoading = () => {
    return (
        <LoadingState
            title="Loading meetings"
            descr="Please while we fetch all your meeting. It may take from a few seconds to minutes."
        />
    )
}

export const MeetingViewError = () => {
    return (
        <ErrorState
            title="Error loading meetings"
            descr="Can't load your meetings. Please try to refresh page."
        />
    )
}

