
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const VideoCallEnded = () => {

    return (
        <div className="flex flex-col items-center justify-center h-full ">
            <div className="flex flex-1 px-4 py-8 items-center justify-center">
                <div className="flex flex-col justify-center items-center gap-y-6 bg-muted/75 rounded-lg p-10 shadow-sm">
                    <div className="flex flex-col text-center gap-y-3 pb-3">
                        <h6 className="text-lg font-medium">You've ended meeting</h6>
                        <p className="text-sm max-w-md">Summary will appear in a few moments. This might take a little time. We appriciate your patience.</p>
                    </div>

                    <Button asChild className="w-[160px]" >
                        <Link href={"/meetings"}>
                            Back to meetings
                        </Link>
                    </Button>

                </div>
            </div>
        </div>
    )

}

