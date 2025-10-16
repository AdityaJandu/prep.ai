import { Button } from "@/components/ui/button";

interface DataPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export const DataPagination = ({ page, onPageChange, totalPages }: DataPaginationProps) => {
    return (
        <div className="flex mt-auto items-center justify-center">
            <div className="flex items-center justify-between gap-x-8 py-4 w-full">
                <Button
                    disabled={page === 1}
                    variant="outline"
                    size="sm"
                    onClick={() => { onPageChange(Math.max(1, page - 1)) }}
                >
                    Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages || 1}
                </div>
                <Button
                    disabled={totalPages === page || totalPages === 0}
                    variant="outline"
                    size="sm"
                    onClick={() => { onPageChange(Math.min(totalPages, page + 1)) }}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

