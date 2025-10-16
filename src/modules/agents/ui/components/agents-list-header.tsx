"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { AgentSearchFilter } from "./agent-search-filter";
import { useAgentFilters } from "../../hooks/use-agents-filter";
import { DEFAULT_PAGE } from "@/constants";

export const AgentsListHeader = () => {
    const [filters, setFilters] = useAgentFilters();
    const [isDialogOpen, setDialogIsOpen] = useState(false);

    const isAnyFilterModified = !!filters.search;

    const onClearFilters = () => {
        setFilters({
            search: "",
            page: DEFAULT_PAGE,
        });
    }

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
                <div className="flex items-center gap-x-2 px-2">
                    <AgentSearchFilter />
                    {isAnyFilterModified &&
                        <Button variant="outline" size="sm" className="border" onClick={onClearFilters} >
                            <XCircleIcon />
                            Clear
                        </Button>
                    }
                </div>
            </div>
        </>
    );
};

