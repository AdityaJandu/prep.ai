
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
    title: string;
    descr: string;
    image?: string
    classNameDiv?: string;
    classNamePara?: string;
};

export const EmptyState = ({
    title,
    descr,
    image = "/empty.svg",
    classNameDiv,
    classNamePara,
}: Props) => {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center px-8 py-4",
            classNameDiv ?? "",
        )}>
            <Image src={image} alt="Empty Image" width={240} height={240} />
            <div className="flex flex-col justify-center gap-y-2 pb-3 max-w-md mx-auto items-center">
                <h6 className="text-lg font-medium">{title}</h6>
                <p className={cn(
                    "text-sm text-muted-foreground text-center",
                    classNamePara,
                )}>{descr}</p>
            </div>
        </div>
    );
};