"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";

export const AgentsListHeader = () => {
    const [isDialogOpen, setDialogIsOpen] = useState(false);

    return (
        <>
            <NewAgentDialog open={isDialogOpen} onOpenChange={setDialogIsOpen} />
            <div className="flex flex-col px-4 py-4 md:px-8 gap-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Agents</h5>
                    <Button onClick={() => setDialogIsOpen(true)}>
                        <PlusIcon />
                        New Agent
                    </Button>
                </div>
            </div>
        </>
    );
};

