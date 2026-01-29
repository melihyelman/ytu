import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClubs, useJoinedClubs, useCreateClub } from "../../features/club/hooks/useClub";
import { useAuthUser } from "../../features/auth/hooks/useAuth";
import ClubList from "../../features/club/components/ClubList";
import Modal from "../../components/ui/Modal";
import CreateClubForm from "../../features/club/components/CreateClubForm";
import { CreateClubInput, ClubResponse } from "../../features/club/types/club";

export default function ClubPage() {
    const navigate = useNavigate();
    const { data: me } = useAuthUser();
    const { data: allClubs, isLoading: loadingAll } = useClubs();
    const { data: joinedClubs, isLoading: loadingJoined } = useJoinedClubs(!!me);
    const { mutateAsync: createClub } = useCreateClub();

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterType, setFilterType] = useState<"all" | "my">("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 3;

    const handleCreateClub = async (data: CreateClubInput) => {
        try {
            await createClub(data);
            setCreateModalOpen(false);
        } catch (error) {
            console.error("Failed to create club", error);
        }
    };

    const isAuthenticated = !!me;
    
    // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS (React Hook Rules)
    // Memoize approved clubs and joined club IDs to prevent unnecessary recalculations
    const approvedClubs = useMemo(() => {
        return (allClubs || []).filter(c => c.status === 'APPROVED');
    }, [allClubs]);

    const joinedClubIds = useMemo(() => {
        return (joinedClubs || []).map(c => c.id);
    }, [joinedClubs]);

    // Filtering logic
    const filteredClubs = useMemo((): ClubResponse[] => {
        try {
            let clubs: ClubResponse[] = [];
            
            // Apply filter type
            if (filterType === "my" && isAuthenticated) {
                clubs = approvedClubs.filter(c => joinedClubIds.includes(c.id));
            } else {
                clubs = [...approvedClubs];
            }

            // Apply search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                clubs = clubs.filter(club => 
                    club?.name?.toLowerCase().includes(query)
                );
            }

            return clubs;
        } catch (error) {
            console.error("Error filtering clubs:", error);
            return [];
        }
    }, [approvedClubs, filterType, searchQuery, isAuthenticated, joinedClubIds]);

    // Pagination logic
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredClubs.length / itemsPerPage));
    }, [filteredClubs.length, itemsPerPage]);

    // Ensure currentPage is valid
    const validCurrentPage = useMemo(() => {
        if (totalPages === 0) return 1;
        if (currentPage > totalPages) return totalPages;
        if (currentPage < 1) return 1;
        return currentPage;
    }, [currentPage, totalPages]);

    const paginatedClubs = useMemo(() => {
        const startIndex = (validCurrentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredClubs.slice(startIndex, endIndex);
    }, [filteredClubs, validCurrentPage, itemsPerPage]);

    // Sync currentPage if it's invalid (only when totalPages changes)
    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages]); // Only depend on totalPages, not currentPage

    const handleSearchChange = (query: string) => {
        setCurrentPage(1); // Reset to first page when search changes
        setSearchQuery(query);
    };

    const handleFilterChange = (filter: "all" | "my") => {
        setCurrentPage(1); // Reset to first page when filter changes
        setFilterType(filter);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Early returns AFTER all hooks
    if (loadingAll || loadingJoined) {
        return <div className="flex justify-center p-8">Yükleniyor...</div>;
    }

    // Safety check
    if (!allClubs) {
        return <div className="flex justify-center p-8">Kulüpler yüklenirken bir hata oluştu.</div>;
    }

    const getEmptyMessage = () => {
        if (searchQuery.trim() && filterType === "my") {
            return "Üye olduğunuz kulüpler arasında arama kriterlerine uygun kulüp bulunamadı.";
        } else if (searchQuery.trim()) {
            return "Arama kriterlerine uygun kulüp bulunamadı.";
        } else if (filterType === "my") {
            return "Henüz üye olduğunuz bir kulüp bulunmuyor.";
        }
        return "Henüz kulüp bulunmuyor.";
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">Kulüpler</h1>
                    {isAuthenticated && (
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Yeni Kulüp İsteği Oluştur
                        </button>
                    )}
                </div>
                <p className="text-gray-600">
                    {isAuthenticated 
                        ? "Kulüplere katılın veya kendi kulübünüzü oluşturun"
                        : "Kulüpleri keşfedin. Katılmak için giriş yapın"}
                </p>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                    {/* Search Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="club-search" className="block text-sm font-medium text-gray-700 mb-2">
                            Arama
                        </label>
                        <div className="relative">
                            <input
                                id="club-search"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
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
                            <label htmlFor="club-filter" className="block text-sm font-medium text-gray-700 mb-2">
                                Filtre
                            </label>
                            <div className="relative">
                                <select
                                    id="club-filter"
                                    value={filterType}
                                    onChange={(e) => handleFilterChange(e.target.value as "all" | "my")}
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

            {/* Clubs List with Pagination */}
            {!paginatedClubs || paginatedClubs.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">{getEmptyMessage()}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <ClubList 
                        title={filterType === "my" ? "Üye Olduğum Kulüpler" : "Tüm Kulüpler"} 
                        clubs={paginatedClubs || []} 
                        showJoinButton={isAuthenticated && filterType === "all"}
                        showLeaveButton={filterType === "my"}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => handlePageChange(validCurrentPage - 1)}
                                disabled={validCurrentPage === 1}
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
                                        (page >= validCurrentPage - 1 && page <= validCurrentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                    validCurrentPage === page
                                                        ? "bg-indigo-600 text-white"
                                                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (
                                        page === validCurrentPage - 2 ||
                                        page === validCurrentPage + 2
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
                                onClick={() => handlePageChange(validCurrentPage + 1)}
                                disabled={validCurrentPage === totalPages}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Sonraki
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isAuthenticated && (
                <Modal
                    open={isCreateModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    title="Yeni Kulüp İsteği Oluştur"
                >
                    <CreateClubForm 
                        onSubmit={handleCreateClub} 
                        onCancel={() => setCreateModalOpen(false)} 
                    />
                </Modal>
            )}
        </div>
    );
}
