"use client";

import { EmptyState } from "@/components/self/empty-state";
import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";



export const MeetingView = () => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    if (data.items.length === 0) {
        return (
            <EmptyState
                title="Create your first meeting"
                descr="Create a meeting to join in with agent. Each meeting will have an agent that follows your instruction and can participate in discussion during meetings."
            />
        );
    };


    return (
        <div className="flex flex-col h-full w-full m-auto p-4 justify-center items-center">
            <h1>MeetingView</h1>
            <br />
            <h1>DATA TABLE HERE</h1>
            <br />
            <p>
                {JSON.stringify(data, null, 2)}
            </p>
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

