import { EmptyState } from "@/components/self/empty-state";
import { Button } from "@/components/ui/button";
import { VideoIcon, BanIcon } from "lucide-react";
import Link from "next/link";

interface Props {
    meetingId: string;
    onCancelMeeting: () => void;
    isCancelling: boolean;
};

export const UpcomingState = ({
    meetingId,
    onCancelMeeting,
    isCancelling,
}: Props) => {
    return (
        <div >
            <EmptyState
                title="Meeting is not started yet."
                descr="Once you start a meeting and after it ends there will be a summary here."
                image="/upcoming.svg"
            />

            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                <Button
                    variant="outline"
                    className=" bg-red-200  min-w-[180px] hover:bg-red-400"
                    onClick={onCancelMeeting}
                    disabled={isCancelling}
                >
                    <BanIcon />
                    <h5>Cancel Meeting</h5>
                </Button>
                <Button disabled={isCancelling} asChild className="hover:bg-[#34C759] min-w-[180px]">
                    <Link href={`/call/${meetingId}`}>
                        <VideoIcon />
                        <h5>Start Meeting</h5>
                    </Link>
                </Button>
            </div>
        </div>
    );
};