"use client";

import { authClient } from "@/lib/auth-client";
import { LoadingState } from "@/components/self/loading-state";
import { ChatUI } from "./chat-ui";

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

