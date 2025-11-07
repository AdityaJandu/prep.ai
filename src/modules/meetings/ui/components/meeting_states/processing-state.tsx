import { EmptyState } from "@/components/self/empty-state";


export const ProcessingState = () => {
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