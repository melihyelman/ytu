import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEventById, useEvent, useEventParticipants } from "../../features/event/hooks/useEvent";
import { useClubById, useManagedClubs } from "../../features/club/hooks/useClub";
import { useAuthUser } from "../../features/auth/hooks/useAuth";
import { isAdmin } from "../../features/auth/utils/isAdmin";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Modal from "../../components/ui/Modal";
import EventForm from "../../features/event/components/EventForm";
import { UpdateEventInput } from "../../features/event/types/event";

export default function EventProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const eventId = id ? parseInt(id) : 0;

    const { data: event, isLoading: loadingEvent } = useEventById(eventId);
    const { data: club, isLoading: loadingClub } = useClubById(event?.clubId || 0);
    const { data: me } = useAuthUser();
    const { data: managedClubs } = useManagedClubs(!!me);
    const { updateEvent, deleteEvent, joinEvent, leaveEvent, isUpdating, isDeleting, isJoining, isLeaving } = useEvent();

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"details" | "club" | "participants">("details");

    const { data: participants = [], isLoading: loadingParticipants } = useEventParticipants(eventId);

    if (loadingEvent || loadingClub) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-lg text-gray-600">Yükleniyor...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Etkinlik Bulunamadı</h2>
                    <button
                        onClick={() => navigate("/events")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Etkinliklere Dön
                    </button>
                </div>
            </div>
        );
    }

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

    // Kullanıcının bu etkinliği düzenleme yetkisi var mı?
    const isClubManager = managedClubs?.some(c => c.id === event.clubId);
    const canEdit = isClubManager || isAdmin(me);

    const handleUpdate = async (data: UpdateEventInput) => {
        try {
            await updateEvent(eventId, data);
            setEditModalOpen(false);
            alert("Etkinlik başarıyla güncellendi!");
        } catch (error: any) {
            console.error("Güncelleme hatası:", error);
            alert(error.response?.data?.message || "Etkinlik güncellenirken bir hata oluştu");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Bu etkinliği silmek istediğinize emin misiniz?")) return;
        try {
            await deleteEvent(eventId);
            alert("Etkinlik başarıyla silindi!");
            navigate("/events");
        } catch (error: any) {
            console.error("Silme hatası:", error);
            alert(error.response?.data?.message || "Etkinlik silinirken bir hata oluştu");
        }
    };

    const handleJoin = async () => {
        if (!me) {
            if (confirm("Etkinliğe katılmak için giriş yapmanız gerekiyor. Giriş sayfasına gitmek ister misiniz?")) {
                navigate("/login");
            }
            return;
        }
        try {
            await joinEvent(eventId);
            alert("Etkinliğe başarıyla katıldınız!");
        } catch (error: any) {
            console.error("Katılma hatası:", error);
            alert(error.response?.data?.message || "Etkinliğe katılırken bir hata oluştu");
        }
    };

    const handleLeave = async () => {
        if (!me) return;
        if (!confirm("Etkinlikten ayrılmak istediğinize emin misiniz?")) return;
        try {
            await leaveEvent(eventId);
            alert("Etkinlikten başarıyla ayrıldınız!");
        } catch (error: any) {
            console.error("Ayrılma hatası:", error);
            alert(error.response?.data?.message || "Etkinlikten ayrılırken bir hata oluştu");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Image */}
            {event.imageUrl && (
                <div className="w-full h-96 relative">
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="container mx-auto">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(event.status)}`}>
                                    {getStatusText(event.status)}
                                </span>
                                {event.isClubExclusive && (
                                    <span className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        Kulübe Özel
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
                            <p className="text-xl text-gray-200">{event.description}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="container mx-auto px-4 py-8">
                {/* No image fallback header */}
                {!event.imageUrl && (
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(event.status)}`}>
                                {getStatusText(event.status)}
                            </span>
                            {event.isClubExclusive && (
                                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    Kulübe Özel
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{event.title}</h1>
                        <p className="text-xl text-gray-600">{event.description}</p>
                    </div>
                )}

                {/* Navigation & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/events")}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            ← Etkinliklere Dön
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {canEdit && (
                            <>
                                <button
                                    onClick={() => setEditModalOpen(true)}
                                    disabled={isUpdating}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Düzenle
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Sil
                                </button>
                            </>
                        )}

                        {event.status === "APPROVED" && !canEdit && (
                            <>
                                {event.isParticipating ? (
                                    <button
                                        onClick={handleLeave}
                                        disabled={isLeaving}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition disabled:bg-gray-400"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Katılımdan Ayrıl
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleJoin}
                                        disabled={isJoining || (event.capacity ? (event.participantCount || 0) >= event.capacity : false)}
                                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:bg-gray-400 text-lg font-semibold"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {event.capacity && (event.participantCount || 0) >= event.capacity ? "Kapasite Dolu" : "Etkinliğe Katıl"}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "details"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Etkinlik Detayları
                        </button>
                        <button
                            onClick={() => setActiveTab("club")}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "club"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Kulüp Bilgileri
                        </button>
                        <button
                            onClick={() => setActiveTab("participants")}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "participants"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Katılımcılar ({event.participantCount || 0})
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {activeTab === "details" && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                {event.detailsMarkdown ? (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Detaylı Açıklama</h2>
                                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 prose-code:text-pink-600 prose-pre:bg-gray-900 prose-pre:text-gray-100">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {event.detailsMarkdown}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hakkında</h2>
                                        <p className="text-gray-700 text-lg">{event.description}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "club" && club && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Düzenleyen Kulüp</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{club.name}</h3>
                                        <p className="text-gray-700">{club.description}</p>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="font-medium">Kurucu:</span> {club.ownerUsername}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="font-medium">{club.memberCount}</span> üye
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <span className={`inline-block px-3 py-1.5 text-sm font-semibold rounded-full border ${
                                            club.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                            club.status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200' :
                                            'bg-blue-100 text-blue-800 border-blue-200'
                                        }`}>
                                            {club.status === 'APPROVED' ? 'Onaylı Kulüp' : club.status === 'REJECTED' ? 'Reddedilmiş' : 'Beklemede'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "participants" && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Katılımcılar ({participants.length})
                                </h2>
                                {loadingParticipants ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="text-gray-600">Yükleniyor...</div>
                                    </div>
                                ) : participants.length === 0 ? (
                                    <div className="text-center py-8">
                                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <p className="text-gray-500 text-lg">Henüz katılımcı yok</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {participants.map((participant) => (
                                            <div
                                                key={participant.id}
                                                onClick={() => navigate(`/users/${participant.userId}`)}
                                                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                                            >
                                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {participant.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate">
                                                        {participant.username}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {participant.email}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Katıldı: {new Date(participant.joinedAt).toLocaleDateString("tr-TR")}
                                                    </p>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Event Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Etkinlik Bilgileri</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-600">Tarih & Saat</p>
                                        <p className="font-semibold text-gray-900">{formatDate(event.eventDate)}</p>
                                    </div>
                                </div>

                                {event.location && (
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-600">Konum</p>
                                            <p className="font-semibold text-gray-900">{event.location}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-600">Kulüp</p>
                                        <p className="font-semibold text-gray-900">{event.clubName}</p>
                                    </div>
                                </div>

                                {event.capacity && (
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-600">Katılımcılar</p>
                                            <p className="font-semibold text-gray-900">
                                                {event.participantCount || 0} / {event.capacity}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!event.capacity && event.participantCount !== undefined && (
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-600">Katılımcılar</p>
                                            <p className="font-semibold text-gray-900">{event.participantCount} kişi</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-600">Oluşturan</p>
                                        <p className="font-semibold text-gray-900">{event.createdByUsername}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <p className="text-xs text-gray-500">
                                        Oluşturulma: {formatDate(event.createdAt)}
                                    </p>
                                    {event.updatedAt && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Son güncelleme: {formatDate(event.updatedAt)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                open={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Etkinliği Düzenle"
            >
                <EventForm
                    mode="update"
                    defaultValues={{
                        title: event.title,
                        description: event.description,
                        detailsMarkdown: event.detailsMarkdown,
                        eventDate: event.eventDate,
                        location: event.location,
                        capacity: event.capacity,
                        imageUrl: event.imageUrl,
                        isClubExclusive: event.isClubExclusive,
                    }}
                    onSubmit={handleUpdate}
                    submitLabel="Güncelle"
                />
            </Modal>
        </div>
    );
}

