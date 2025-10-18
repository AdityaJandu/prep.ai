
import Image from "next/image";
import Link from "next/link";

import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

interface VideoCallActiveProps {
    onLeave: () => void;
    meetingName: string;
};

export const VideoCallActive = ({ onLeave, meetingName }: VideoCallActiveProps) => {


    return (
        <div className="flex flex-col p-4 justify-between h-full text-white">
            <div className="bg-[#101213] rounded-full p-4 gap-4 flex items-center">
                <Link href="/" className="flex items-center justify-center bg-white/10 p-1 rounded-full w-fit">
                    <Image src="/logo.svg" width={24} height={24} alt="Logo" />
                </Link>
                <h4 className="text-base">{meetingName}</h4>
            </div>
            <SpeakerLayout />
            <div className="bg-[#101213] rounded-full px-4">
                <CallControls onLeave={onLeave} />
            </div>
        </div>
    );
};