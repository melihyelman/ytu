import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApprovedEvents, useEventsByClubId, useEvent } from "../../features/event/hooks/useEvent";
import { useAuthUser } from "../../features/auth/hooks/useAuth";
import { usePublicClubs } from "../../features/club/hooks/useClub";
import EventList from "../../features/event/components/EventList";
import { EventResponse } from "../../features/event/types/event";

export default function PublicEventsPage() {
    const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 3;
    const { data: allEvents, isLoading: isLoadingAllEvents } = useApprovedEvents();
    const { data: clubEvents, isLoading: isLoadingClubEvents } = useEventsByClubId(selectedClubId || 0);
    const { data: clubs, isLoading: isLoadingClubs } = usePublicClubs();
    const { data: me, isLoading: isLoadingAuth } = useAuthUser();
    const { joinEvent, leaveEvent, isJoining, isLeaving } = useEvent();
    const navigate = useNavigate();

    // Determine which events to show based on filter
    const events = selectedClubId ? clubEvents : allEvents;
    const isLoading = isLoadingAuth || (selectedClubId ? isLoadingClubEvents : isLoadingAllEvents) || isLoadingClubs;

    const handleJoin = async (id: number) => {
        if (!me) {
            if (confirm("Etkinliğe katılmak için giriş yapmanız gerekiyor. Giriş sayfasına gitmek ister misiniz?")) {
                navigate("/login");
            }
            return;
        }
        try {
            await joinEvent(id);
            alert("Etkinliğe başarıyla katıldınız!");
        } catch (error: any) {
            console.error("Katılma hatası:", error);
            alert(error.response?.data?.message || "Etkinliğe katılırken bir hata oluştu");
        }
    };

    const handleLeave = async (id: number) => {
        if (!me) return;
        if (!confirm("Etkinlikten ayrılmak istediğinize emin misiniz?")) return;
        try {
            await leaveEvent(id);
            alert("Etkinlikten ayrıldınız");
        } catch (error: any) {
            console.error("Ayrılma hatası:", error);
            alert(error.response?.data?.message || "Etkinlikten ayrılırken bir hata oluştu");
        }
    };

    const handleDetailClick = (event: EventResponse) => {
        navigate(`/events/${event.id}`);
    };

    const handleClubFilterChange = (clubId: string) => {
        setCurrentPage(1); // Reset to first page when filter changes
        if (clubId === "") {
            setSelectedClubId(null);
        } else {
            setSelectedClubId(parseInt(clubId, 10));
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getEmptyMessage = () => {
        if (selectedClubId) {
            const selectedClub = clubs?.find(club => club.id === selectedClubId);
            return selectedClub 
                ? `${selectedClub.name} kulübüne ait etkinlik bulunamadı.`
                : "Bu kulübe ait etkinlik bulunamadı.";
        }
        return "Şu an onaylanmış etkinlik bulunmamaktadır.";
    };

    // Show loading state
    if (isLoadingAuth) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-lg text-gray-600">Yükleniyor...</div>
            </div>
        );
    }

    // Show login prompt if not authenticated
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
                                Etkinliklere Katılın
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

    // Show events list for authenticated users
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Etkinlikler</h1>
                <p className="text-gray-600">Yaklaşan ve güncel etkinliklere göz atın ve katılın!</p>
            </div>

            {/* Club Filter */}
            <div className="mb-6 max-w-md mx-auto">
                <label htmlFor="club-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Kulüp Filtresi
                </label>
                <div className="relative">
                    <select
                        id="club-filter"
                        value={selectedClubId || ""}
                        onChange={(e) => handleClubFilterChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none cursor-pointer"
                    >
                        <option value="">Tümü</option>
                        {clubs?.map((club) => (
                            <option key={club.id} value={club.id}>
                                {club.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <EventList
                events={events || []}
                loading={isLoading || isJoining || isLeaving}
                emptyMessage={getEmptyMessage()}
                onJoin={handleJoin}
                onLeave={handleLeave}
                onClick={handleDetailClick}
                showParticipation={true}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
}




