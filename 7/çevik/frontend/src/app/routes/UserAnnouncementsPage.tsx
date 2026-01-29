import { useState, useMemo } from "react";
import { useActiveAnnouncements, useClubAnnouncements } from "../../features/announcement/hooks/useAnnouncement";
import { usePublicClubs } from "../../features/club/hooks/useClub";
import { AnnouncementDTO } from "../../features/announcement/types/announcement";
import AnnouncementGridList from "../../features/announcement/components/AnnouncementGridList";
import AnnouncementDetailModal from "../../features/announcement/components/AnnouncementDetailModal";

export default function UserAnnouncementsPage() {
    const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementDTO | null>(null);
    const [activeTab, setActiveTab] = useState<"system" | "club" | "event">("system");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 3;

    const { data: allAnnouncements, isLoading: isLoadingAll, error } = useActiveAnnouncements();
    const { data: clubAnnouncements, isLoading: isLoadingClub } = useClubAnnouncements(selectedClubId || 0);
    const { data: clubs, isLoading: isLoadingClubs } = usePublicClubs();

    // Determine which announcements to use based on club filter
    const baseAnnouncements = selectedClubId ? clubAnnouncements : allAnnouncements;
    const isLoading = isLoadingAll || (selectedClubId ? isLoadingClub : false) || isLoadingClubs;

    // Filtreleme - Tab + Arama
    const filteredAnnouncements = useMemo((): AnnouncementDTO[] => {
        let filtered = baseAnnouncements || [];
        
        // Tab filtresi
        switch (activeTab) {
            case "system":
                // Admin duyuruları (clubId yok)
                filtered = filtered.filter((a: AnnouncementDTO) => !a.clubId && !a.eventId);
                break;
            case "club":
                // Kulüp duyuruları (clubId var, eventId yok)
                filtered = filtered.filter((a: AnnouncementDTO) => a.clubId && !a.eventId);
                break;
            case "event":
                // Etkinlik duyuruları (clubId ve eventId var)
                filtered = filtered.filter((a: AnnouncementDTO) => a.clubId && a.eventId);
                break;
            default:
                break;
        }

        // Arama filtresi (başlık ve açıklamada ara)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter((a: AnnouncementDTO) => 
                a.title.toLowerCase().includes(query) ||
                a.description.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [baseAnnouncements, activeTab, searchQuery]);

    const handleClubFilterChange = (clubId: string) => {
        setCurrentPage(1); // Reset to first page when filter changes
        if (clubId === "") {
            setSelectedClubId(null);
        } else {
            setSelectedClubId(parseInt(clubId, 10));
        }
    };

    const handleSearchChange = (query: string) => {
        setCurrentPage(1); // Reset to first page when search changes
        setSearchQuery(query);
    };

    const handleTabChange = (tab: "system" | "club" | "event") => {
        setCurrentPage(1); // Reset to first page when tab changes
        setActiveTab(tab);
    };

    const handleClearFilters = () => {
        setCurrentPage(1);
        setSelectedClubId(null);
        setSearchQuery("");
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hasActiveFilters = selectedClubId !== null || searchQuery.trim() !== "";

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Duyurular</h1>
                <p className="text-gray-600 text-center">
                    Kulüplerimizden ve etkinliklerimizden haberdar olun
                </p>
            </div>

            {/* Filters Section */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                    {/* Club Filter */}
                    <div className="flex-1 min-w-[200px]">
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

                    {/* Search Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-2">
                            Arama
                        </label>
                        <div className="relative">
                            <input
                                id="search-filter"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Başlık veya açıklamada ara..."
                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <div>
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Filtreleri Temizle
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => handleTabChange("system")}
                        className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "system"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Sistem Duyuruları
                    </button>
                    <button
                        onClick={() => handleTabChange("club")}
                        className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "club"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Kulüp Duyuruları
                    </button>
                    <button
                        onClick={() => handleTabChange("event")}
                        className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "event"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Etkinlik Duyuruları
                    </button>
                </nav>
            </div>

            {/* Duyuru Listesi */}
            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
                    <svg className="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium">Duyurular yüklenirken bir hata oluştu</p>
                </div>
            ) : (
                <AnnouncementGridList
                    announcements={filteredAnnouncements}
                    loading={isLoading}
                    emptyMessage={
                        hasActiveFilters
                            ? selectedClubId && searchQuery.trim()
                                ? "Seçilen kriterlere uygun duyuru bulunamadı."
                                : selectedClubId
                                ? (() => {
                                    const selectedClub = clubs?.find(club => club.id === selectedClubId);
                                    return selectedClub 
                                        ? `${selectedClub.name} kulübüne ait duyuru bulunamadı.`
                                        : "Bu kulübe ait duyuru bulunamadı.";
                                })()
                                : "Arama kriterlerine uygun duyuru bulunamadı."
                            : activeTab === "system" 
                                ? "Şu an sistem duyurusu bulunmamaktadır." 
                                : activeTab === "club"
                                ? "Şu an kulüp duyurusu bulunmamaktadır."
                                : "Şu an etkinlik duyurusu bulunmamaktadır."
                    }
                    onClick={(announcement) => setSelectedAnnouncement(announcement)}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            )}

            <AnnouncementDetailModal
                announcement={selectedAnnouncement}
                onClose={() => setSelectedAnnouncement(null)}
            />
        </div>
    );
}

