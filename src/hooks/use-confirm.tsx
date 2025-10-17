
import { JSX, useState } from "react";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/self/responsive-dialog";


export const useConfirm = (
    title: string,
    descr: string,
): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void;
    } | null>(null);

    const confirm = () => {
        return new Promise((resolve) => {
            setPromise({ resolve });
        });
    };

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmationDialog = () => (
        <ResponsiveDialog title={title} descr={descr} open={promise !== null} onOpenChange={handleClose}>
            <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-center" >
                <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full lg:max-w-40"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    className="w-full lg:max-w-40"
                >
                    Confirm
                </Button>
            </div>
        </ResponsiveDialog>
    );

    return [ConfirmationDialog, confirm];
};