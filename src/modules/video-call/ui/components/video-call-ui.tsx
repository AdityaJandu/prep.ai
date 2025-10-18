
import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { VideoCallLobby } from "./video-call-lobby";
import { VideoCallActive } from "./video-call-active";
import { VideoCallEnded } from "./video-call-ended";

interface VideoCallUIProps {
    meetingName: string;
};

export const VideoCallUI = ({ meetingName }: VideoCallUIProps) => {

    const call = useCall();
    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

    const handleJoin = async () => {
        if (!call) return;

        await call.join();

        setShow("call");
    }

    const handleLeave = () => {
        if (!call) return;

        call.endCall();

        setShow("ended");
    }

    return (
        <StreamTheme className="h-full">
            {show === "lobby" &&
                <VideoCallLobby onJoin={handleJoin} />
            }
            {show === "call" &&
                <VideoCallActive onLeave={handleLeave} meetingName={meetingName} />
            }
            {show === "ended" &&
                <VideoCallEnded />
            }
        </StreamTheme>
    )
}