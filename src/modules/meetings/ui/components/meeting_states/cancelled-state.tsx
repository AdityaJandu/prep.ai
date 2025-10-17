import { EmptyState } from "@/components/self/empty-state";

interface Props {
    meetingId: string;
};

export const CancelledState = ({
    meetingId,
}: Props) => {
    return (
        <div >
            <EmptyState
                title="Meeting was cancelled."
                descr="This meeting was cancelled and can't be accessed now. Try creating a new meeting."
                image="/cancelled.svg"
            />
        </div >
    );
};