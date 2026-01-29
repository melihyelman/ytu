import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EventResponse } from "../types/event";
import Modal from "@/components/ui/Modal";

interface EventDetailModalProps {
    event: EventResponse | null;
    open: boolean;
    onClose: () => void;
}

export default function EventDetailModal({ event, open, onClose }: EventDetailModalProps) {
    if (!event) return null;

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
        <Modal open={open} onClose={onClose} title={event.title}>
            <div className="space-y-4">
                {event.imageUrl && (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                )}

                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 text-sm font-semibold rounded-full border ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                    </span>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Kısa Açıklama</h3>
                    <p className="text-gray-700">{event.description}</p>
                </div>

                {event.detailsMarkdown && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Detaylı Açıklama</h3>
                        <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
                            <div className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-600 prose-code:text-pink-600 prose-pre:bg-gray-900 prose-pre:text-gray-100">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {event.detailsMarkdown}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3 text-gray-700">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold mr-2">Tarih:</span> {formatDate(event.eventDate)}
                    </div>
                    {event.location && (
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-semibold mr-2">Yer:</span> {event.location}
                        </div>
                    )}
                    {event.capacity && (
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="font-semibold mr-2">Kapasite:</span> {event.participantCount || 0}/{event.capacity}
                        </div>
                    )}
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-semibold mr-2">Kulüp:</span> {event.clubName}
                    </div>
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-semibold mr-2">Oluşturan:</span> {event.createdByUsername}
                    </div>
                    {event.isClubExclusive && (
                        <div className="flex items-center text-indigo-600 font-medium">
                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span>Kulübe Özel Etkinlik</span>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

