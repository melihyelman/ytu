import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getClubById, getClubMembers } from "../../features/club/api/clubApi";
import { eventApi } from "../../features/event/api/eventApi";
import { getClubAnnouncements } from "../../features/announcement/api/announcementApi";
import Modal from "../../components/ui/Modal";
import type { AnnouncementDTO } from "../../features/announcement/types/announcement";
import type { EventResponse } from "../../features/event/types/event";
import { useAuthUser } from "../../features/auth/hooks/useAuth";

export default function ClubProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const clubId = parseInt(id || "0", 10);
    const { data: me } = useAuthUser();

    if (!me) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto">
                        {/* Hero Section */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                                Kulüplere Katılın!
                            </h1>
                        </div>

                        {/* CTA Buttons */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Hesabınızı Oluşturun! 🚀
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                                Hesap oluşturun ve kampüsümüzdeki tüm etkinliklere erişim sağlayın. 
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate("/register")}
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Ücretsiz Kayıt Ol
                                </button>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Giriş Yap
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementDTO | null>(null);

    const { data: club, isLoading: clubLoading } = useQuery({
        queryKey: ["club", clubId],
        queryFn: () => getClubById(clubId),
        enabled: !!clubId,
    });

    const { data: members = [], isLoading: membersLoading } = useQuery({
        queryKey: ["clubMembers", clubId],
        queryFn: () => getClubMembers(clubId),
        enabled: !!clubId,
    });

    const { data: events = [], isLoading: eventsLoading } = useQuery({
        queryKey: ["clubEvents", clubId],
        queryFn: () => eventApi.getEventsByClubId(clubId),
        enabled: !!clubId,
    });

    const { data: announcements = [], isLoading: announcementsLoading } = useQuery({
        queryKey: ["clubAnnouncements", clubId],
        queryFn: () => getClubAnnouncements(clubId),
        enabled: !!clubId,
    });

    const isLoading = clubLoading || membersLoading || eventsLoading || announcementsLoading;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!club) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Kulüp bulunamadı</h2>
                    <button
                        onClick={() => navigate("/clubs")}
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        Kulüpler sayfasına dön
                    </button>
                </div>
            </div>
        );
    }

    const approvedMembers = members.filter((m) => m.status === "APPROVED");

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{club.name}</h1>
                        <p className="text-gray-600 mb-4">{club.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {club.memberCount} üye
                            </span>
                            <span>Kurucu: {club.ownerUsername}</span>
                            <span>Oluşturulma: {new Date(club.createdAt).toLocaleDateString("tr-TR")}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/clubs")}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Members Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Üyeler ({approvedMembers.length})
                        </h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {approvedMembers.length === 0 ? (
                                <p className="text-gray-500 text-sm">Henüz üye yok</p>
                            ) : (
                                approvedMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        onClick={() => navigate(`/users/${member.userId}`)}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{member.username}</p>
                                            <p className="text-sm text-indigo-600">{member.roleName || "Üye"}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(member.joinDate).toLocaleDateString("tr-TR")}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Announcements & Events Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Announcements */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                            Duyurular ({announcements.length})
                        </h2>
                        <div className="space-y-3">
                            {announcements.length === 0 ? (
                                <p className="text-gray-500 text-sm">Henüz duyuru yok</p>
                            ) : (
                                announcements.map((announcement) => (
                                    <div
                                        key={announcement.id}
                                        onClick={() => setSelectedAnnouncement(announcement)}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    {announcement.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {announcement.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                    <span>{announcement.createdByUsername}</span>
                                                    <span>•</span>
                                                    <span>{new Date(announcement.createdAt).toLocaleDateString("tr-TR")}</span>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Events */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Etkinlikler ({events.length})
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {events.length === 0 ? (
                                <p className="text-gray-500 text-sm">Henüz etkinlik yok</p>
                            ) : (
                                events.map((event: EventResponse) => (
                                    <div
                                        key={event.id}
                                        onClick={() => navigate(`/events/${event.id}`)}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex items-start gap-4">
                                            {event.imageUrl && (
                                                <img
                                                    src={event.imageUrl}
                                                    alt={event.title}
                                                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                                    {event.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                    {event.description}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {new Date(event.eventDate).toLocaleDateString("tr-TR")}
                                                    </span>
                                                    {event.location && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {event.location}
                                                        </span>
                                                    )}
                                                    {event.capacity && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                            {event.participantCount || 0}/{event.capacity}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcement Detail Modal */}
            <Modal
                open={!!selectedAnnouncement}
                onClose={() => setSelectedAnnouncement(null)}
                title={selectedAnnouncement?.title}
            >
                {selectedAnnouncement && (
                    <div className="space-y-4">
                        {selectedAnnouncement.imageUrl && (
                            <img
                                src={selectedAnnouncement.imageUrl}
                                alt={selectedAnnouncement.title}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        )}
                        <div>
                            <p className="text-gray-700 whitespace-pre-wrap mb-4">
                                {selectedAnnouncement.description}
                            </p>
                            {selectedAnnouncement.detailsMarkdown && (
                                <div className="prose max-w-none">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: selectedAnnouncement.detailsMarkdown,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="border-t pt-4 flex items-center justify-between text-sm text-gray-500">
                            <span>Yayınlayan: {selectedAnnouncement.createdByUsername}</span>
                            <span>{new Date(selectedAnnouncement.createdAt).toLocaleString("tr-TR")}</span>
                        </div>
                        {selectedAnnouncement.eventTitle && (
                            <div className="bg-indigo-50 p-3 rounded-lg">
                                <p className="text-sm text-indigo-700">
                                    🎉 Bu duyuru <strong>{selectedAnnouncement.eventTitle}</strong> etkinliği ile ilgilidir
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
