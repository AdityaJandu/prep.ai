import { EmptyState } from "@/components/self/empty-state";


export const CancelledState = () => {
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