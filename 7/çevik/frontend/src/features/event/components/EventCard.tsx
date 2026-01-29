import { EventResponse } from "../types/event";

interface EventCardProps {
    event: EventResponse;
    onEdit?: (event: EventResponse) => void;
    onDelete?: (id: number) => void;
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
    onJoin?: (id: number) => void;
    onLeave?: (id: number) => void;
    onClick?: (event: EventResponse) => void;
    showActions?: boolean;
    showAdminActions?: boolean;
    showParticipation?: boolean;
}

export default function EventCard({
    event,
    onEdit,
    onDelete,
    onApprove,
    onReject,
    onJoin,
    onLeave,
    onClick,
    showActions = false,
    showAdminActions = false,
    showParticipation = false,
}: EventCardProps) {
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
                return "bg-blue-100 text-blue-800 border-blue-200";
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
            onClick={!showAdminActions && onClick ? () => onClick(event) : undefined}
            role={onClick && !showAdminActions ? "button" : undefined}
        >
            {event.imageUrl && (
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                    </span>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(event.eventDate)}</span>
                    </div>
                    {event.location && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.location}</span>
                        </div>
                    )}
                    {event.capacity && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="font-medium">{event.participantCount || 0}/{event.capacity}</span>
                        </div>
                    )}
                    {!event.capacity && event.participantCount !== undefined && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="font-medium">{event.participantCount} katılımcı</span>
                        </div>
                    )}
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>{event.clubName}</span>
                    </div>
                    {event.isClubExclusive && (
                        <div className="flex items-center text-indigo-600 font-medium">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span>Kulübe Özel</span>
                        </div>
                    )}
                </div>

                {(showActions || showAdminActions || showParticipation) && (
                    <div className="flex gap-2 mt-auto pt-3 border-t flex-wrap">
                        {showActions && (
                            <>
                                {onEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(event);
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
                                            onDelete(event.id);
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
                                            onApprove(event.id);
                                        }}
                                        disabled={event.status === "APPROVED"}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {event.status === "APPROVED" ? "✓ Onaylandı" : "Onayla"}
                                    </button>
                                )}
                                {/* Red butonu */}
                                {onReject && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onReject(event.id);
                                        }}
                                        disabled={event.status === "REJECTED"}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {event.status === "REJECTED" ? "✗ Reddedildi" : "Reddet"}
                                    </button>
                                )}
                            </>
                        )}

                        {showParticipation && event.status === "APPROVED" && (
                            <>
                                {event.isParticipating ? (
                                    onLeave && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onLeave(event.id);
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Katılımdan Ayrıl
                                        </button>
                                    )
                                ) : (
                                    onJoin && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onJoin(event.id);
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                            disabled={event.capacity ? (event.participantCount || 0) >= event.capacity : false}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Katıl
                                        </button>
                                    )
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

