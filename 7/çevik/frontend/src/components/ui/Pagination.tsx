interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const validPage = Math.max(1, Math.min(currentPage, totalPages));

    return (
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
            <button
                onClick={() => onPageChange(validPage - 1)}
                disabled={validPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Önceki
            </button>
            <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= validPage - 1 && page <= validPage + 1)
                    ) {
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    validPage === page
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                {page}
                            </button>
                        );
                    } else if (
                        page === validPage - 2 ||
                        page === validPage + 2
                    ) {
                        return (
                            <span key={page} className="px-2 text-gray-500">
                                ...
                            </span>
                        );
                    }
                    return null;
                })}
            </div>
            <button
                onClick={() => onPageChange(validPage + 1)}
                disabled={validPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Sonraki
            </button>
        </div>
    );
}
