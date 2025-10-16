"use client";

// NPM imports:
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";


// Local imports:
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { DashboardUserButton } from "./dashboard-user-buttom";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const firstSection = [
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings",
    },
    {
        icon: BotIcon,
        label: "Agents",
        href: "/agents",
    },
];

const secondSection = [
    {
        icon: StarIcon,
        label: "Upgrade",
        href: "/upgrade",
    },
];

export const DashboardSidebar = () => {
    const pathName = usePathname();

    return (
        <Sidebar>
            <SidebarHeader className=" text-sidebar-accent-foreground">
                <Link href="/" className="flex items-center gap-2 px-4 pt-2 ">
                    <Image src="/logo.svg" height={36} width={36} alt="Prep.AI" />
                    <p className="text-2xl font-semibold">Prep.ai</p>
                </Link>
            </SidebarHeader>

            <div className="px-4 py-2">
                <Separator className="my-2 bg-amber-100 opacity-40" />
            </div>

            <SidebarContent>
                {/* Section 1 */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                firstSection.map((obj) => {
                                    return (
                                        <SidebarMenuButton asChild className={cn(
                                            "h-10 hover:bg-linear-to-l/oklch border border-transparent hover:border-[#5d6b68]/50 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                            pathName === obj.href && "bg-linear-to-r/oklch border-[#5d6b68]/20"
                                        )}
                                            isActive={pathName === obj.href}
                                            key={obj.href}>
                                            <Link href={obj.href}>
                                                <obj.icon />
                                                <span className="text-sm font-medium tracking-tight">
                                                    {obj.label}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )
                                }
                                )
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <div className="px-4 py-2">
                    <Separator className="bg-amber-100 opacity-40" />
                </div>

                {/* Section 2 */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                secondSection.map((obj) => {
                                    return (
                                        <SidebarMenuButton asChild className={cn(
                                            "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5d6b68]/20 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                            pathName === obj.href && "bg-linear-to-r/oklch border-[#5d6b68]/20"
                                        )}
                                            isActive={pathName === obj.href}
                                            key={obj.href}>
                                            <Link href={obj.href}>
                                                <obj.icon />
                                                <span className="text-sm font-medium tracking-tight">
                                                    {obj.label}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )
                                }
                                )
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter>
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    );
};

