"use client";

import { authClient } from "@/lib/auth-client";
import { VideoCallConnect } from "./video-call-connect";
import { VideoCallViewLoading } from "../views/video-call-view";
import { generateAvatar } from "@/lib/avatar";


interface VideoCallProviderProps {
    meetingId: string;
    meetingName: string;
};

export const VideoCallProvider = ({ meetingId, meetingName }: VideoCallProviderProps) => {

    const { data, isPending } = authClient.useSession();


    if (isPending || !data) {
        return (
            <VideoCallViewLoading />
        );
    };


    return (
        <VideoCallConnect
            meetingId={meetingId}
            meetingName={meetingName}
            userId={data?.user.id}
            userName={data?.user.name}
            userImage={
                data?.user.image ??
                generateAvatar({ seed: data.user.name, variant: "initials" })
            }
        />
    );

};