import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnnouncementDTO } from "../types/announcement";
import Modal from "@/components/ui/Modal";

interface AnnouncementDetailModalProps {
    announcement: AnnouncementDTO | null;
    onClose: () => void;
}

export default function AnnouncementDetailModal({ announcement, onClose }: AnnouncementDetailModalProps) {
    const navigate = useNavigate();
    
    if (!announcement) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleEventClick = () => {
        if (announcement.eventId) {
            onClose();
            navigate(`/events/${announcement.eventId}`);
        }
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

    const getAnnouncementType = () => {
        if (!announcement.clubId && !announcement.eventId) {
            return { text: "Admin Duyurusu", color: "text-indigo-600", icon: "🏛️" };
        } else if (announcement.clubId && !announcement.eventId) {
            return { text: "Kulüp Duyurusu", color: "text-blue-600", icon: "📢" };
        } else if (announcement.clubId && announcement.eventId) {
            return { text: "Etkinlik Duyurusu", color: "text-purple-600", icon: "🎪" };
        }
        return { text: "Duyuru", color: "text-gray-600", icon: "📄" };
    };

    const announcementType = getAnnouncementType();

    return (
        <Modal open={!!announcement} onClose={onClose} title={announcement.title}>
            <div className="space-y-4">
                {announcement.imageUrl && (
                    <img
                        src={announcement.imageUrl}
                        alt={announcement.title}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                )}

                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1.5 text-sm font-semibold rounded-full border ${getStatusColor(announcement.approvalStatus)}`}>
                        {getStatusText(announcement.approvalStatus)}
                    </span>
                    <span className={`px-3 py-1.5 text-sm font-semibold ${announcementType.color}`}>
                        {announcementType.icon} {announcementType.text}
                    </span>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Kısa Açıklama</h3>
                    <p className="text-gray-700">{announcement.description}</p>
                </div>

                {announcement.detailsMarkdown && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Detaylı Açıklama</h3>
                        <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
                            <div className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-600 prose-code:text-pink-600 prose-pre:bg-gray-900 prose-pre:text-gray-100">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {announcement.detailsMarkdown}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3 text-gray-700">
                    {announcement.clubName && (
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="font-semibold mr-2">Kulüp:</span> {announcement.clubName}
                        </div>
                    )}
                    {announcement.eventTitle && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-semibold mr-2">Etkinlik:</span> {announcement.eventTitle}
                            </div>
                            {announcement.eventId && (
                                <button
                                    onClick={handleEventClick}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Etkinliğe Git
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-semibold mr-2">Oluşturan:</span> {announcement.createdByUsername}
                    </div>
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold mr-2">Tarih:</span> {formatDate(announcement.createdAt)}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
