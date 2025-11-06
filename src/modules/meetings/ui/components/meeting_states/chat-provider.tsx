"use client";

import { authClient } from "@/lib/auth-client";
import { LoadingState } from "@/components/self/loading-state";
import { EmptyState } from "@/components/self/empty-state";
import { ChatUI } from "./chat-ui";
import { generateAvatar } from "@/lib/avatar";

interface Props {
    meetingId: string,
    meetingName: string,
};


export const ChatProvider = ({ meetingId, meetingName }: Props) => {
    const { data, isPending } = authClient.useSession();

    if (isPending || !data?.user) {
        return <LoadingState
            title="Loading chats"
            descr="This may take a while to load. Thanks for your patience."
        />
    }

    return (
        <ChatUI
            meetingId={meetingId}
            meetingName={meetingName}
            userId={data.user.id}
            userName={data.user.name}
            userImage={data.user.image}
        />
    );
};

