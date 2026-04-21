export function SkeletonCashDrawerDetails() {
    return (
        <div className="animate-pulse p-4">
            <div className="grid grid-cols-6 gap-4 mb-4">
                <div className="col-span-3 bg-bg-content rounded-lg border border-bg-subtle p-4 flex flex-col items-center justify-center gap-2">
                    <div className="h-3 bg-bg-subtle rounded w-2/3"></div>
                    <div className="h-8 bg-bg-subtle rounded w-3/4"></div>
                </div>
                <div className="col-span-3 bg-bg-content rounded-lg border border-bg-subtle p-4 flex flex-col items-center justify-center gap-2">
                    <div className="h-3 bg-bg-subtle rounded w-2/3"></div>
                    <div className="h-8 bg-bg-subtle rounded w-3/4"></div>
                </div>
            </div>

            <div className="grid grid-cols-9 gap-4">
                <div className="col-span-3 bg-bg-content rounded-lg border border-bg-subtle p-4 flex flex-col items-center justify-center gap-2">
                    <div className="h-3 bg-bg-subtle rounded w-1/2"></div>
                    <div className="h-8 bg-bg-subtle rounded w-3/4"></div>
                </div>
                <div className="col-span-3 bg-bg-content rounded-lg border border-bg-subtle p-4 flex flex-col items-center justify-center gap-2">
                    <div className="h-3 bg-bg-subtle rounded w-1/2"></div>
                    <div className="h-8 bg-bg-subtle rounded w-3/4"></div>
                </div>
                <div className="col-span-3 bg-bg-content rounded-lg border border-bg-subtle p-4 flex flex-col items-center justify-center gap-2">
                    <div className="h-3 bg-bg-subtle rounded w-1/2"></div>
                    <div className="h-8 bg-bg-subtle rounded w-3/4"></div>
                </div>
            </div>
        </div>
    );
}
