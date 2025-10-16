
import { AlertCircleIcon } from "lucide-react";

interface Props {
    title: string;
    descr: string;
};

export const ErrorState = ({ title, descr }: Props) => {
    return (
        <div className="flex flex-1 items-center justify-center px-8 py-4">
            <div className="flex flex-col items-center justify-center bg-destructive/15 rounded-lg p-12 text-red-500 gap-4 shadow-sm">
                <AlertCircleIcon className="size-8" />
                <div className="flex flex-col justify-center items-center">
                    <h6 className="text-lg font-medium">{title}</h6>
                    <p className="text-sm">{descr}</p>
                </div>
            </div>
        </div>
    );
};