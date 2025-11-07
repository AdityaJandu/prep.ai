import {
    CircleXIcon,
    CircleCheckIcon,
    ClockArrowUpIcon,
    VideoIcon,
    LoaderIcon,
} from "lucide-react";

import { CommandSelect } from "@/components/self/command-select";

import { MeetingStatus } from "../../types";
import { useMeetingsFilters } from "../../hooks/use-meetings-filter";

const options = [
    // Upcoming:
    {
        id: MeetingStatus.Upcoming,
        value: MeetingStatus.Upcoming,
        children: (
            <div className="flex items-center gap-x-4 capitalize">
                <ClockArrowUpIcon />
                <p>Upcoming</p>
            </div>
        ),
    },

    // Processing
    {
        id: MeetingStatus.Processing,
        value: MeetingStatus.Processing,
        children: (
            <div className="flex items-center gap-x-4 capitalize">
                <LoaderIcon className="animate-spin" />
                <p>Processing</p>
            </div>
        ),
    },

    // Active
    {
        id: MeetingStatus.Active,
        value: MeetingStatus.Active,
        children: (
            <div className="flex items-center gap-x-4 capitalize">
                <VideoIcon />
                <p>Active</p>
            </div>
        ),
    },

    // Completed
    {
        id: MeetingStatus.Completed,
        value: MeetingStatus.Completed,
        children: (
            <div className="flex items-center gap-x-4 capitalize">
                <CircleCheckIcon />
                <p>Completed</p>
            </div>
        ),
    },

    // Cancelled
    {
        id: MeetingStatus.Cancelled,
        value: MeetingStatus.Cancelled,
        children: (
            <div className="flex items-center gap-x-4 capitalize">
                <CircleXIcon />
                <p>Cancelled</p>
            </div>
        ),
    },
];


export const StatusFilter = () => {
    const [filters, setFilters] = useMeetingsFilters();

    return (
        <CommandSelect
            placeholder="Status"
            className="h-9"
            options={options}
            onSelect={(value) => setFilters({ status: value as MeetingStatus })}
            value={filters.status ?? ""}
        />
    );
}