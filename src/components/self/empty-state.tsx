
import Image from "next/image";

interface Props {
    title: string;
    descr: string;
};

export const EmptyState = ({ title, descr }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center px-8 py-4">
            <Image src="/empty.svg" alt="Empty Image" width={240} height={240} />
            <div className="flex flex-col justify-center gap-y-6 max-w-md mx-auto items-center">
                <h6 className="text-lg font-medium">{title}</h6>
                <p className="text-sm text-muted-foreground">{descr}</p>
            </div>
        </div>
    );
};