"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const HomeView = () => {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const logOut = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => router.push("/sign-in"),
            },
        });
    };

    if (!session) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner className="size-6" />
                <h1 className="text-xl"> Loading....</h1>
            </div>
        );
    };

    return (
        <div className="flex flex-col p-4 gap-4 justify-center items-center">
            <h1>Welcome!</h1>
            <h3>{session!.user.name}</h3>
            <Button onClick={logOut}>Logout</Button>
        </div>
    );
};

export default HomeView;
