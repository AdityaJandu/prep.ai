
// NPM imports:
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// Local imports:
import { authClient } from "@/lib/auth-client";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/self/generated-avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoadingState } from "@/components/self/loading-state";
import { toast } from "sonner";

export const DashboardUserButton = () => {
    const { data, isPending } = authClient.useSession();
    const router = useRouter();
    const isMobile = useIsMobile();

    const [isLoading, setIsLoading] = useState(false);

    const onLogOut = async () => {
        setIsLoading(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => router.push("/sign-in"),
                },
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    };

    if (!data?.user || isPending) {
        return null;
    }

    if (isLoading) {
        return (
            <LoadingState
                title={"Log out"}
                descr={"Please wait while we log you out"}
            />
        );
    }

    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/30 hover:bg-white/40 overflow-hidden gap-x-2">
                    {data.user.image ?
                        <Avatar className="size-9" >
                            <AvatarImage src={data.user.image} />
                            <AvatarFallback>{data.user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        :
                        <GeneratedAvatar seed={data.user.name} variant="initials" className="size-9" />
                    }

                    <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                        <p className="text-sm truncate w-full">
                            {data.user.name}
                        </p>
                        <p className="text-xs truncate w-full">
                            {data.user.email}
                        </p>
                    </div>

                    <ChevronDownIcon className="size-4 shrink-0" />
                </DrawerTrigger>

                <DrawerContent className="pb-8">
                    <DrawerHeader>
                        <DrawerTitle className="font-medium truncate">
                            {data.user.name}
                        </DrawerTitle>
                        <DrawerDescription className="font-medium truncate">
                            {data.user.email}
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter >
                        <Button variant="outline">
                            Billing
                            <CreditCardIcon className="size-4" />
                        </Button>
                        <Button variant="outline" onClick={onLogOut}>
                            Logout
                            <LogOutIcon className="size-4" />
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/30 hover:bg-white/40 overflow-hidden gap-x-2">
                {data.user.image ?
                    <Avatar className="size-9" >
                        <AvatarImage src={data.user.image} />
                        <AvatarFallback>{data.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    :
                    <GeneratedAvatar seed={data.user.name} variant="initials" className="size-9" />
                }

                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm truncate w-full">
                        {data.user.name}
                    </p>
                    <p className="text-xs truncate w-full">
                        {data.user.email}
                    </p>
                </div>

                <ChevronDownIcon className="size-4 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-64 rounded-2xl">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1 items-center justify-center">
                        <span className="font-medium truncate">{data.user.name}</span>
                        <span className="text-sm font-normal text-muted-foreground truncate">{data.user.email}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="px-4 py-2 flex items-center justify-between cursor-pointer">
                    Billing
                    <CreditCardIcon className="size-4" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogOut} className="px-4 py-2 flex items-center justify-between cursor-pointer">
                    Logout
                    <LogOutIcon className="size-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

