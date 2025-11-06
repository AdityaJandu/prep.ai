"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MeetingGetMany } from "../../types";
import { GeneratedAvatar } from "@/components/self/generated-avatar";

import {
    CornerDownRightIcon,
    VideoIcon,
    CircleCheckIcon,
    CircleXIcon,
    ClockFadingIcon,
    LoaderIcon,
    CircleArrowUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import { cn, formatTimeDuration } from "@/lib/utils";


const statusIconMap = {
    upcoming: CircleArrowUp,
    active: LoaderIcon,
    completed: CircleCheckIcon,
    processing: LoaderIcon,
    cancelled: CircleXIcon,
};

const statusColorMap = {
    upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
    active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
    completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
    processing: "bg-rose-500/20 text-rose-800 border-rose-800/5",
    cancelled: "bg-gray-300/20 text-gray-800 border-gray-800/5",
}

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
    {
        accessorKey: "name",
        header: "Meeting Name",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col gap-y-1">
                    <span className="font-semibold capitalize">{row.original.name}</span>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-x-1">
                            <CornerDownRightIcon className="size-3 text-muted-foreground" />
                            <span className="text-sm max-w-[200px] truncate capitalize text-muted-foreground">
                                {row.original.agent.name}
                            </span>
                        </div>
                        <GeneratedAvatar
                            seed={row.original.agent.name}
                            variant="botttsNeutral"
                            className="size-5"
                        />
                        <span className="text-sm text-muted-foreground">
                            {row.original.startedAt ? format(row.original.startedAt, "MMM d") : ""}
                        </span>
                    </div>
                </div>
            );
        }
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const StatusIcon = statusIconMap[row.original.status as keyof typeof statusIconMap];

            return (
                <Badge
                    variant="outline"
                    className={cn(
                        "flex items-center gap-x-2 [&>svg]:size-3 p-2 rounded-2xl",
                        statusColorMap[row.original.status as keyof typeof statusColorMap]
                    )}
                >
                    <StatusIcon
                        className={cn(
                            row.original.status === "processing" && "animate-spin"
                        )}
                    />
                    <p className="text-[9px] capitalize">{row.original.status}</p>
                </Badge>
            );
        }
    },

    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => {
            const StatusIcon = statusIconMap[row.original.status as keyof typeof statusIconMap];

            return (
                <Badge
                    variant="outline"
                    className="flex items-center gap-x-2 [&>svg]:size-3 p-2 rounded-2xl"
                >
                    <ClockFadingIcon className="text-blue-600" />
                    <p className="text-[9px]">{row.original.duration ? formatTimeDuration(row.original.duration) : "Meeting pending"}</p>
                </Badge>
            );
        }
    },

]