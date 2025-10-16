"use client";

import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ResponsiveDialog } from "@/components/self/responsive-dialog";
import { Button } from "@/components/ui/button";

export const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <p>{JSON.stringify(data, null, 2)}</p>
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