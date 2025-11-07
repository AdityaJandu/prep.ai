
import Link from "next/link";

import {
    DefaultVideoPlaceholder,
    StreamVideoParticipant,
    ToggleAudioPreviewButton,
    ToggleVideoPreviewButton,
    useCallStateHooks,
    VideoPreview,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { authClient } from "@/lib/auth-client";
import { generateAvatar } from "@/lib/avatar";
import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";

interface VideoCallLobbyProps {
    onJoin: () => void;
};


export const VideoCallLobby = ({ onJoin }: VideoCallLobbyProps) => {

    const { useCameraState, useMicrophoneState } = useCallStateHooks();

    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCameraPermission } = useCameraState();

    const hasBrowserMediaPermission = hasMicPermission && hasCameraPermission;


    return (
        <div className="flex flex-col items-center justify-center h-full ">
            <div className="flex flex-1 px-4 py-8 items-center justify-center">
                <div className="flex flex-col justify-center items-center gap-y-6 bg-muted/75 rounded-lg p-10 shadow-sm">
                    <div className="flex flex-col text-center gap-y-2">
                        <h6 className="text-lg font-medium">Ready to join?</h6>
                        <p className="text-sm ">Setup your call before joining</p>
                    </div>
                    <VideoPreview
                        DisabledVideoPreview={
                            hasBrowserMediaPermission
                                ? DisabledVideoPreview
                                : AllowBrowserPermission
                        }
                    />

                    <div className="flex gap-x-3">
                        <ToggleAudioPreviewButton />
                        <ToggleVideoPreviewButton />
                    </div>

                    <div className="flex gap-x-2 justify-between w-full">
                        <Button asChild variant="outline" className="w-[160px]" >
                            <Link href={"/meetings"}>
                                Cancel
                            </Link>
                        </Button>
                        <Button className="w-[160px]" onClick={onJoin}>
                            <LogInIcon />
                            <h5>Join</h5>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

}


// Disabled Preview:
const DisabledVideoPreview = () => {
    const { data } = authClient.useSession();

    return (
        <DefaultVideoPlaceholder
            participant={
                {
                    name: data?.user.name ?? "",
                    image: data?.user.image ??
                        generateAvatar(
                            {
                                seed: data?.user.name ?? "",
                                variant: "initials"
                            }
                        ),
                } as StreamVideoParticipant
            }
        />
    );
};


// Const allow browser premission:
const AllowBrowserPermission = () => {
    return (
        <p className="text-sm">
            Please grant your browser premission to access your camera and microphone for best meeting experience.
        </p>
    );
};