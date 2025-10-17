import { EmptyState } from "@/components/self/empty-state";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props {
    meetingId: string;
};

export const ActiveState = ({
    meetingId,
}: Props) => {
    return (
        <div >
            <EmptyState
                title="Meeting is started."
                descr="You can join meeting by pressing button below and once this meeting ends there will be a summary here about the meeting."
                image="/upcoming.svg"
            />

            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                <Button asChild className="hover:bg-[#15be53] hover:text-black w-[240px]">
                    <Link href={`/call/${meetingId}`}>
                        <VideoIcon />
                        <h5>Join Meeting</h5>
                    </Link>
                </Button>
            </div>
        </div>
    );
};