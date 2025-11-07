"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { GeneratedAvatar } from "@/components/self/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { UpcomingState } from "../components/meeting_states/upcoming-state";
import { ActiveState } from "../components/meeting_states/active-state";
import { CancelledState } from "../components/meeting_states/cancelled-state";
import { ProcessingState } from "../components/meeting_states/processing-state";
import { CompletedState } from "../components/meeting_states/completed-state";

interface MeetingIdViewProps {
    meetingId: string;
};

export const MeetingIdView = ({ meetingId }: MeetingIdViewProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({
            id: meetingId
        })
    );

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                // INVALIDATE FREE TIER USAGE:
                router.push("/meetings");
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }),
    );


    const isDeletePending = removeMeeting.isPending;

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are your sure?",
        `The following action will remove ${data.name} associated meetings`
    );

    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove();

        if (!ok) return;

        removeMeeting.mutate({ id: meetingId });
    };



    // Constants for meeting status:
    const isActive = data.status === "active";
    const isProcessing = data.status === "processing";
    const isCompleted = data.status === "completed";
    const isCancelled = data.status === "cancelled";
    const isUpcoming = data.status === "upcoming";

    if (isDeletePending) {
        return (
            <LoadingState
                title="Deleting meeting"
                descr="Please wait while we delete your meeting"
            />
        );
    };


    return (
        <>
            <RemoveConfirmation />
            <UpdateMeetingDialog
                open={updateMeetingDialogOpen}
                onOpenChange={setUpdateMeetingDialogOpen}
                initialValues={data}
            />

            <div className="flex-1 px-4 py-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data.name}
                    onRemove={handleRemoveMeeting}
                    onEdit={() => setUpdateMeetingDialogOpen(true)}
                />

                {
                    !isCompleted &&
                    <div className=" bg-white rounded-lg border px-4 py-5 gap-y-5 flex flex-col">
                        <div className="flex items-center flex-col md:flex-row gap-x-3.5">
                            <GeneratedAvatar
                                seed={data.name}
                                variant="botttsNeutral"
                                className="size-18"
                            />
                            <h2 className="text-2xl font-medium">{data.name}</h2>
                            <Badge variant="outline" className="flex mt-5 mb-3 md:my-0 rounded-2xl md:ml-auto px-2 py-1 items-center gap-x-2 [&>svg]:size-4">
                                <VideoIcon className="text-blue-600" />
                                <h6 className="text-xs">{data.name} </h6>
                            </Badge>
                        </div>
                    </div>
                }

                {
                    !isCompleted &&
                    <div className="bg-white rounded-lg border sm:px-2 px-4 py-8 gap-y-5 flex flex-col">
                        {isUpcoming &&
                            <UpcomingState
                                meetingId={meetingId}
                                onCancelMeeting={handleRemoveMeeting}
                                isCancelling={false}
                            />
                        }

                        {
                            isActive &&
                            <ActiveState meetingId={meetingId} />
                        }

                        {
                            isCancelled &&
                            <CancelledState />
                        }

                        {
                            isProcessing &&
                            <ProcessingState />
                        }

                    </div>
                }

                {
                    isCompleted &&
                    <CompletedState data={data} />
                }

            </div>
        </>
    );
};


export const MeetingIdViewLoading = () => {
    return (
        <LoadingState
            title="Loading the meeting"
            descr="This may take from a few seconds to a few minutes."
        />
    );
};

export const MeetingIdViewError = () => {
    return (
        <ErrorState
            title="Failed to load neeting"
            descr="Something went wrong while fetching meeting. Try to refresh page."
        />
    );
};
