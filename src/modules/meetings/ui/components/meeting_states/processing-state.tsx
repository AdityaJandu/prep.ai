import { EmptyState } from "@/components/self/empty-state";
import { Button } from "@/components/ui/button";
import { VideoIcon, BanIcon } from "lucide-react";
import Link from "next/link";

interface Props {
    meetingId: string;
};

export const ProcessingState = ({
    meetingId,
}: Props) => {
    return (
        <div >
            <EmptyState
                title="Meeting in Processing state"
                descr="Meeting is in proceesing state and it may take a while to process the data and we expect you to wait for the summary."
                image="/processing.svg"
            />
        </div>
    );
};