"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftIcon, PanelLeftClose, Search } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

const DashboardNavbar = () => {
    const { state, toggleSidebar, isMobile } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);


    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandOpen((commandOpen) => !commandOpen);
            }
        };

        document.addEventListener("keydown", down);

        return () => document.removeEventListener("keydown", down);
    }, []);


    return (
        <>
            <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
            <nav className="flex items-center px-4 gap-x-2 py-3 border-b bg-background">
                <Button className="size-10" variant="outline" onClick={toggleSidebar}>
                    {
                        (state === "collapsed" || isMobile)
                            ? <PanelLeftIcon />
                            : <PanelLeftClose />
                    }
                </Button>
                <Button onClick={
                    () => {
                        setCommandOpen((commandOpen) => !commandOpen);
                    }
                }
                    className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground" size="sm" variant="outline">
                    <Search /> Search
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ">
                        <span className="text-xs">&#8984;</span>K
                    </kbd>
                </Button>
            </nav>
        </>
    );
};

export default DashboardNavbar;