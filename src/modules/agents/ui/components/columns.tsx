"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetOne } from "../../types"
import { GeneratedAvatar } from "@/components/self/generated-avatar"
import { CornerDownRightIcon, VideoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"



export const columns: ColumnDef<AgentGetOne>[] = [
    {
        accessorKey: "name",
        header: "Agent Name",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <GeneratedAvatar seed={row.original.name} variant="botttsNeutral" className="size-6" />
                        <span className="font-semibold capitalize">{row.original.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <CornerDownRightIcon className="size-3 text-muted-foreground" />
                        <span className="text-sm max-w-[200px] truncate capitalize text-muted-foreground">
                            {row.original.instruction}
                        </span>
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: "meetingCount",
        header: "Meetings",
        cell: ({ row }) => {
            return (
                <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4 p-2 rounded-2xl">
                    <VideoIcon className="text-blue-700" />
                    <p>{row.original.meetingCount} {row.original.meetingCount === 1 ? "meeting " : "meetings"} </p>
                </Badge>
            );
        }
    }

]