import { AnnouncementDTO } from "../types/announcement";

interface AnnouncementCardProps {
    announcement: AnnouncementDTO;
    onEdit?: (announcement: AnnouncementDTO) => void;
    onDelete?: (id: number) => void;
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
    onClick?: (announcement: AnnouncementDTO) => void;
    showActions?: boolean;
    showAdminActions?: boolean;
}

export default function AnnouncementCard({
    announcement,
    onEdit,
    onDelete,
    onApprove,
    onReject,
    onClick,
    showActions = false,
    showAdminActions = false,
}: AnnouncementCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "PENDING":
                return "bg-indigo-100 text-indigo-800 border-indigo-200";
            case "REJECTED":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "Onaylandı";
            case "PENDING":
                return "Beklemede";
            case "REJECTED":
                return "Reddedildi";
            default:
                return status;
        }
    };

    return (
        <div 
            className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col ${onClick && !showAdminActions ? 'cursor-pointer' : ''}`}
            onClick={!showAdminActions && onClick ? () => onClick(announcement) : undefined}
            role={onClick && !showAdminActions ? "button" : undefined}
        >
            {announcement.imageUrl && (
                <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(announcement.approvalStatus)}`}>
                        {getStatusText(announcement.approvalStatus)}
                    </span>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-3">{announcement.description}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-3">
                    {/* Duyuru Tipi Badge */}
                    {!announcement.clubId && !announcement.eventId ? (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold">
                            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Admin Duyurusu
                        </div>
                    ) : announcement.clubId && !announcement.eventId ? (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                            Kulüp Duyurusu
                        </div>
                    ) : (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Etkinlik Duyurusu
                        </div>
                    )}

                    {announcement.clubName && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>Kulüp: {announcement.clubName}</span>
                        </div>
                    )}
                    {announcement.eventTitle && (
                        <div className="flex items-center text-purple-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Etkinlik: {announcement.eventTitle}</span>
                        </div>
                    )}
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Oluşturan: {announcement.createdByUsername}</span>
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatDate(announcement.createdAt)}</span>
                    </div>
                    {!announcement.isActive && (
                        <div className="flex items-center text-red-600 font-medium">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                            <span>Pasif</span>
                        </div>
                    )}
                </div>

                {(showActions || showAdminActions) && (
                    <div className="flex gap-2 mt-auto pt-3 border-t flex-wrap">
                        {showActions && (
                            <>
                                {onEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(announcement);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Düzenle
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(announcement.id);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Sil
                                    </button>
                                )}
                            </>
                        )}

                        {showAdminActions && (
                            <>
                                {/* Onay butonu */}
                                {onApprove && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onApprove(announcement.id);
                                        }}
                                        disabled={announcement.approvalStatus === "APPROVED"}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {announcement.approvalStatus === "APPROVED" ? "✓ Onaylandı" : "Onayla"}
                                    </button>
                                )}
                                {/* Red butonu */}
                                {onReject && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onReject(announcement.id);
                                        }}
                                        disabled={announcement.approvalStatus === "REJECTED"}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {announcement.approvalStatus === "REJECTED" ? "✗ Reddedildi" : "Reddet"}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
