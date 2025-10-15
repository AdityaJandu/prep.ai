"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const HomeView = () => {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const logOut = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => router.push('/sign-in')
            }
        });
    }

    if (!session) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    return (
        <div className="flex flex-col p-4 gap-4 justify-center items-center">
            <h1>Logged in as: {session.user.name}</h1>
            <Button onClick={() => logOut()}>Logout</Button>
        </div>

    );
};

export default HomeView;