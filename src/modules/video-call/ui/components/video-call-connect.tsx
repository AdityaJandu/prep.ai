"use client";

import {
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    Call,
    CallingState,
} from "@stream-io/video-react-sdk";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useTRPC } from "@/trpc/client";
import { VideoCallViewLoading } from "../views/video-call-view";
import { VideoCallUI } from "./video-call-ui";


interface VideoCallConnectProps {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string;
}

export const VideoCallConnect = ({
    meetingId,
    meetingName,
    userId,
    userName,
    userImage,
}: VideoCallConnectProps) => {

    const trpc = useTRPC();

    const { mutateAsync: generateToken } = useMutation(
        trpc.meetings.generateToken.mutationOptions(),
    );

    const [client, setClient] = useState<StreamVideoClient>();

    useEffect(() => {
        const _client = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
            user: {
                id: userId,
                name: userName,
                image: userImage,
            },
            tokenProvider: generateToken,
        });

        setClient(_client);

        return () => {
            _client.disconnectUser();
            setClient(undefined);
        }
    }, [
        userId,
        userName,
        userImage,
        generateToken,
    ]);

    const [call, setCall] = useState<Call>();

    useEffect(() => {
        if (!client) return;

        const _call = client.call("default", meetingId);
        _call.camera.disable();
        _call.microphone.disable();

        setCall(_call);

        return () => {
            if (_call.state.callingState !== CallingState.LEFT) {
                _call.leave();
                _call.endCall();
                setCall(undefined);
            }
        }

    }, [client, meetingId]);


    if (!call || !client) {
        return (
            <VideoCallViewLoading />
        );
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <VideoCallUI
                    meetingName={meetingName}
                />
            </StreamCall>
        </StreamVideo>
    )
};