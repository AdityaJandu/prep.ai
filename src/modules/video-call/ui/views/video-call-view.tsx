"use client";

import { EmptyState } from '@/components/self/empty-state';
import { ErrorState } from '@/components/self/error-state';
import { LoadingState } from '@/components/self/loading-state';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'
import { VideoCallProvider } from '../components/video-call-provider';

interface VideoCallViewProps {
    meetingId: string;
};

export const VideoCallView = ({ meetingId }: VideoCallViewProps) => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId }),
    );

    if (data.status === "completed") {
        return (
            <div className="flex items-center h-screen text-white justify-center">
                <EmptyState
                    title="Meeting ended"
                    descr="This meeting has ended and now you can't join this meeting."
                    image='/processing.svg'
                    classNameDiv='bg-gray-300/20 rounded-3xl'
                    classNamePara='text-white'
                />
            </div>
        );
    };


    return (
        <VideoCallProvider
            meetingId={meetingId}
            meetingName={data.name}
        />
    );
};

export const VideoCallViewLoading = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <LoadingState
                title="Loading meeting"
                descr="Please wait while we load the meeting. It may take a while. Thanks for the patience."
            />
        </div>
    );
};

export const VideoCallViewError = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <ErrorState
                title="Error loading meeting"
                descr="Looks like there's an error while loading meeting. Please try refreshing or joining again."
            />
        </div >
    );
};
