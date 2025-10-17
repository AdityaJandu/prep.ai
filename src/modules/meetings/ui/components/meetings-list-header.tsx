"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useState } from "react";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { StatusFilter } from "./status-filters";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilters } from "../../hooks/use-meetings-filter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE } from "@/constants";

export const MeetingsListHeader = () => {
    const [filters, setFilters] = useMeetingsFilters();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isAnyFilterModified =
        !!filters.status || !!filters.agentId || !!filters.search;

    const onClearFilters = () => {
        setFilters({
            status: null,
            agentId: "",
            search: "",
            page: DEFAULT_PAGE,
        });
    };

    return (
        <>
            <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
            <div className="flex flex-col px-4 py-4 md:px-8 gap-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Meetings</h5>
                    <Button onClick={() => { setIsDialogOpen(true) }}>
                        <PlusIcon />
                        New Meeting
                    </Button>
                </div>
                <ScrollArea>
                    <div className="flex items-center gap-x-2 px-2">
                        <MeetingsSearchFilter />
                        <StatusFilter />
                        <AgentIdFilter />

                        {isAnyFilterModified &&
                            <Button
                                onClick={() => { onClearFilters() }}
                                variant="outline"
                                className="flex items-center text-muted-foreground"
                            >
                                <XCircleIcon className="size-4" />
                                <h5>Cancel</h5>
                            </Button>
                        }
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </>
    );
};

