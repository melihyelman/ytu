import { AnnouncementDTO } from "../types/announcement";
import AnnouncementCard from "./AnnouncementCard";

interface AnnouncementGridListProps {
    announcements: AnnouncementDTO[];
    loading?: boolean;
    emptyMessage?: string;
    onEdit?: (announcement: AnnouncementDTO) => void;
    onDelete?: (id: number) => void;
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
    onClick?: (announcement: AnnouncementDTO) => void;
    showActions?: boolean;
    showAdminActions?: boolean;
    currentPage?: number;
    itemsPerPage?: number;
    onPageChange?: (page: number) => void;
}

export default function AnnouncementGridList({
    announcements,
    loading = false,
    emptyMessage = "Henüz duyuru bulunmuyor.",
    onEdit,
    onDelete,
    onApprove,
    onReject,
    onClick,
    showActions = false,
    showAdminActions = false,
    currentPage = 1,
    itemsPerPage = 10,
    onPageChange,
}: AnnouncementGridListProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!announcements || announcements.length === 0) {
        return (
            <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
            </div>
        );
    }

    // Pagination logic
    const totalPages = onPageChange ? Math.ceil(announcements.length / itemsPerPage) : 1;
    const startIndex = onPageChange ? (currentPage - 1) * itemsPerPage : 0;
    const endIndex = onPageChange ? startIndex + itemsPerPage : announcements.length;
    const paginatedAnnouncements = onPageChange ? announcements.slice(startIndex, endIndex) : announcements;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedAnnouncements.map((announcement) => (
                    <AnnouncementCard
                        key={announcement.id}
                        announcement={announcement}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onApprove={onApprove}
                        onReject={onReject}
                        onClick={onClick}
                        showActions={showActions}
                        showAdminActions={showAdminActions}
                    />
                ))}
            </div>

            {/* Pagination */}
            {onPageChange && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
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
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => onPageChange(page)}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            currentPage === page
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (
                                page === currentPage - 2 ||
                                page === currentPage + 2
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
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Sonraki
                    </button>
                </div>
            )}
        </div>
    );
}

