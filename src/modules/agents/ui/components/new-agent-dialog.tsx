
import { ResponsiveDialog } from "@/components/self/responsive-dialog";
import { AgentForm } from "./agent-form";

interface NewAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}


export const NewAgentDialog = ({ open, onOpenChange }: NewAgentDialogProps) => {
    return (
        <ResponsiveDialog
            title="New Agent"
            descr="Create a new agent"
            open={open}
            onOpenChange={onOpenChange}
        >
            <AgentForm
                onSuccess={() => { onOpenChange(false) }}
                onCancel={() => { onOpenChange(false) }}
            />
        </ResponsiveDialog>
    );
};

