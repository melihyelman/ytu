import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMessages } from "../../features/message/hooks/useMessage.ts";
import { usePublicClubs, useJoinedClubs } from "../../features/club/hooks/useClub";
import { useApprovedEvents } from "../../features/event/hooks/useEvent";
import { useAuthUser } from "../../features/auth/hooks/useAuth";
import UserAnnouncementsPage from "./UserAnnouncementsPage.tsx";
import EventList from "../../features/event/components/EventList";
import { ClubResponse } from "../../features/club/types/club";

// Clubs List with Pagination Component
function ClubsListWithPagination({
  clubs,
  currentPage,
  itemsPerPage,
  onPageChange,
  onClubClick,
}: {
  clubs: ClubResponse[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onClubClick: (clubId: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(clubs.length / itemsPerPage));
  const validPage = Math.max(1, Math.min(Math.max(1, currentPage), totalPages));
  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClubs = clubs.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedClubs.map((club) => (
          <div
            key={club.id}
            onClick={() => onClubClick(club.id)}
            className="bg-white rounded-xl transition border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 cursor-pointer"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{club.name}</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  {club.memberCount} Üye
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3 h-12">
                {club.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-50">
                <span>Kurucu: {club.ownerUsername}</span>
                <span>{new Date(club.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { data: clubs } = usePublicClubs();
  const { data: events } = useApprovedEvents();
  const { data: messages } = useMessages();
  const { data: me, isLoading: isLoadingAuth } = useAuthUser();
  const { data: joinedClubs } = useJoinedClubs(!!me);
  const activeMessage = messages?.find(m => m.status === true);
  const activeClubs = clubs || [];
  const upcomingEvents = events || [];
  
  // Pagination states
  const [eventsCurrentPage, setEventsCurrentPage] = useState<number>(1);
  const [clubsCurrentPage, setClubsCurrentPage] = useState<number>(1);
  const [clubsSearchQuery, setClubsSearchQuery] = useState<string>("");
  const [clubsFilterType, setClubsFilterType] = useState<"all" | "my">("all");
  const eventsItemsPerPage = 3;
  const clubsItemsPerPage = 3;
  
  // Determine if user is authenticated (after loading)
  const isAuthenticated = !isLoadingAuth && !!me;

  // Pagination handlers
  const handleEventsPageChange = (page: number) => {
    setEventsCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clubs filtering logic - MUST be defined before pagination logic
  const joinedClubIds = useMemo(() => {
    return (joinedClubs || []).map(c => c.id);
  }, [joinedClubs]);

  const filteredClubs = useMemo((): ClubResponse[] => {
    try {
      let filtered: ClubResponse[] = [];
      
      // Apply filter type
      if (clubsFilterType === "my" && isAuthenticated) {
        filtered = activeClubs.filter(c => joinedClubIds.includes(c.id));
      } else {
        filtered = [...activeClubs];
      }

      // Search filter
      if (clubsSearchQuery.trim()) {
        const query = clubsSearchQuery.toLowerCase().trim();
        filtered = filtered.filter(club => 
          club?.name?.toLowerCase().includes(query)
        );
      }

      return filtered;
    } catch (error) {
      console.error("Error filtering clubs:", error);
      return [];
    }
  }, [activeClubs, clubsFilterType, clubsSearchQuery, isAuthenticated, joinedClubIds]);

  // Pagination logic for clubs - AFTER filteredClubs is defined
  const clubsTotalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredClubs.length / clubsItemsPerPage));
  }, [filteredClubs.length, clubsItemsPerPage]);

  const validClubsCurrentPage = useMemo(() => {
    if (clubsTotalPages === 0) return 1;
    if (clubsCurrentPage > clubsTotalPages) return clubsTotalPages;
    if (clubsCurrentPage < 1) return 1;
    return clubsCurrentPage;
  }, [clubsCurrentPage, clubsTotalPages]);

  const handleClubsPageChange = (page: number) => {
    if (page >= 1 && page <= clubsTotalPages) {
      setClubsCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync clubsCurrentPage if it's invalid (only when totalPages changes)
  useEffect(() => {
    if (clubsTotalPages > 0 && clubsCurrentPage > clubsTotalPages) {
      setClubsCurrentPage(clubsTotalPages);
    }
  }, [clubsTotalPages]); // Only depend on clubsTotalPages, not clubsCurrentPage

  const handleClubsSearchChange = (query: string) => {
    setClubsCurrentPage(1);
    setClubsSearchQuery(query);
  };

  const handleClubsFilterChange = (filter: "all" | "my") => {
    setClubsCurrentPage(1);
    setClubsFilterType(filter);
  };

  const getClubsEmptyMessage = () => {
    if (clubsSearchQuery.trim() && clubsFilterType === "my") {
      return "Üye olduğunuz kulüpler arasında arama kriterlerine uygun kulüp bulunamadı.";
    } else if (clubsSearchQuery.trim()) {
      return "Arama kriterlerine uygun kulüp bulunamadı.";
    } else if (clubsFilterType === "my") {
      return "Henüz üye olduğunuz bir kulüp bulunmuyor.";
    }
    return "Henüz aktif bir kulüp bulunmuyor.";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {activeMessage && (
        <div className="bg-indigo-600 text-white px-4 py-3 text-center shadow-md relative z-50">
          <p className="font-medium">{activeMessage.content}</p>
        </div>
      )}
        <main className="flex-grow">
            {/* Navbar varsa ve yüksekliği ~64px ise */}
            <section className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4" style={{ backgroundImage: `url("./davutpasa-ytu.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="text-center max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Kulüplerle Sosyalleşin
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                        Üniversite hayatınızı renklendirin, yeni insanlarla tanışın ve ilgi alanlarınıza uygun kulüplere katılın.
                    </p>
                </div>
            </section>

        <UserAnnouncementsPage />

        {/* Upcoming Events Section */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Yaklaşan Etkinlikler</h2>
                <p className="text-gray-600">Kampüsümüzdeki en yeni ve popüler etkinliklere göz atın</p>
              </div>
              {isAuthenticated && (
                <button
                  onClick={() => navigate("/events")}
                  className="hidden md:flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Tümünü Gör
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              )}
            </div>
            
            {!isAuthenticated ? (
              // Login CTA for events
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 text-center border-2 border-blue-100">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Etkinliklere Katılın! 🎉
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Hemen ücretsiz hesap oluşturun ve kampüs hayatının tadını çıkarın.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate("/register")}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Ücretsiz Kayıt Ol
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Giriş Yap
                  </button>
                </div>
              </div>
            ) : (
              <EventList
                events={upcomingEvents}
                loading={false}
                emptyMessage="Henüz yaklaşan etkinlik bulunmuyor."
                onClick={(event) => navigate(`/events/${event.id}`)}
                currentPage={eventsCurrentPage}
                itemsPerPage={eventsItemsPerPage}
                onPageChange={handleEventsPageChange}
              />
            )}
          </div>
        </div>

        {/* Active Clubs Section */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Aktif Kulüpler</h2>
          <p className="text-gray-600 mb-8">Kampüsümüzdeki aktif kulüpleri keşfedin</p>
          
          {/* Search and Filter Section */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              {/* Search Filter */}
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="home-club-search" className="block text-sm font-medium text-gray-700 mb-2">
                  Arama
                </label>
                <div className="relative">
                  <input
                    id="home-club-search"
                    type="text"
                    value={clubsSearchQuery}
                    onChange={(e) => handleClubsSearchChange(e.target.value)}
                    placeholder="Kulüp adı ile ara..."
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Filter Dropdown */}
              {isAuthenticated && (
                <div className="min-w-[200px]">
                  <label htmlFor="home-club-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Filtre
                  </label>
                  <div className="relative">
                    <select
                      id="home-club-filter"
                      value={clubsFilterType}
                      onChange={(e) => handleClubsFilterChange(e.target.value as "all" | "my")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none cursor-pointer"
                    >
                      <option value="all">Hepsi</option>
                      <option value="my">Sadece üyelerim</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {filteredClubs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">{getClubsEmptyMessage()}</p>
            </div>
          ) : (
            <ClubsListWithPagination
              clubs={filteredClubs}
              currentPage={validClubsCurrentPage}
              itemsPerPage={clubsItemsPerPage}
              onPageChange={handleClubsPageChange}
              onClubClick={(clubId) => navigate(`/clubs/${clubId}`)}
            />
          )}
        </div>
        </main>
    </div>
  );
}
