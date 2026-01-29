import { useState, useMemo } from "react";
import { useClubs, useApproveClub, useRejectClub } from "../../features/club/hooks/useClub";
import { ClubResponse } from "../../features/club/types/club";
import { useNavigate } from "react-router-dom";
import AdminListControls from "../../components/ui/AdminListControls";
import Pagination from "../../components/ui/Pagination";

export default function AdminClubsPage() {
    const { data: allClubs, isLoading } = useClubs();
    const { mutate: approveClub, isPending: isApproving } = useApproveClub();
    const { mutate: rejectClub, isPending: isRejecting } = useRejectClub();
    const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
    const navigate = useNavigate();

    // Search, Sort, Pagination states
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "name-asc" | "name-desc">("date-desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const sortOptions = [
        { value: "date-desc", label: "En Yeni" },
        { value: "date-asc", label: "En Eski" },
        { value: "name-asc", label: "İsim (A-Z)" },
        { value: "name-desc", label: "İsim (Z-A)" },
    ];

    // Filter, Search, Sort
    const filteredAndSortedClubs = useMemo(() => {
        let result = allClubs || [];
        
        // Tab filter
        switch (activeTab) {
            case "pending":
                result = result.filter((c: ClubResponse) => c.status === "PENDING");
                break;
            case "approved":
                result = result.filter((c: ClubResponse) => c.status === "APPROVED");
                break;
            case "rejected":
                result = result.filter((c: ClubResponse) => c.status === "REJECTED");
                break;
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter((c: ClubResponse) => 
                c.name.toLowerCase().includes(query) ||
                c.description?.toLowerCase().includes(query) ||
                c.ownerUsername?.toLowerCase().includes(query)
            );
        }

        // Sort
        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case "date-desc":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "date-asc":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "name-asc":
                    return a.name.localeCompare(b.name, "tr");
                case "name-desc":
                    return b.name.localeCompare(a.name, "tr");
                default:
                    return 0;
            }
        });

        return result;
    }, [allClubs, activeTab, searchQuery, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedClubs.length / itemsPerPage);
    const paginatedClubs = filteredAndSortedClubs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const pendingCount = allClubs?.filter(c => c.status === "PENDING").length || 0;

    // Reset page when filters change
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleSortChange = (sort: string) => {
        setSortBy(sort as typeof sortBy);
        setCurrentPage(1);
    };

    const handleTabChange = (tab: typeof activeTab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleApprove = (id: number) => {
        if (confirm("Bu kulübü onaylamak istediğinize emin misiniz?")) {
            approveClub(id);
        }
    };

    const handleReject = (id: number) => {
        if (confirm("Bu kulübü reddetmek istediğinize emin misiniz?")) {
            rejectClub(id);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
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
                return "Onaylı";
            case "PENDING":
                return "Beklemede";
            case "REJECTED":
                return "Reddedildi";
            default:
                return status;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Kulüp Yönetimi</h1>
                        <p className="text-gray-600 mt-1">Kulüp taleplerini onaylayın veya reddedin</p>
                    </div>
                    <button
                        onClick={() => navigate("/admin")}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        ← Admin Paneline Dön
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => handleTabChange("pending")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "pending"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Bekleyen Talepler
                        {pendingCount > 0 && (
                            <span className="ml-2 bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-full text-xs font-semibold">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => handleTabChange("approved")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "approved"
                                ? "border-emerald-500 text-emerald-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Onaylanan Kulüpler
                    </button>
                    <button
                        onClick={() => handleTabChange("rejected")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "rejected"
                                ? "border-red-500 text-red-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Reddedilen Kulüpler
                    </button>
                    <button
                        onClick={() => handleTabChange("all")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "all"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Tümü
                    </button>
                </nav>
            </div>

            {/* Search & Sort Controls */}
            <AdminListControls
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Kulüp adı, açıklama veya kurucu ile ara..."
                sortBy={sortBy}
                onSortChange={handleSortChange}
                sortOptions={sortOptions}
                totalCount={allClubs?.length}
                filteredCount={filteredAndSortedClubs.length}
            />

            {/* Kulüp Listesi */}
            {isLoading || isApproving || isRejecting ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : paginatedClubs.length === 0 ? (
                <div className="text-center py-16">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">
                        {searchQuery ? "Arama kriterlerine uygun kulüp bulunamadı." :
                         activeTab === "pending" && "Şu an bekleyen kulüp talebi bulunmamaktadır."}
                        {!searchQuery && activeTab === "approved" && "Şu an onaylı kulüp bulunmamaktadır."}
                        {!searchQuery && activeTab === "rejected" && "Şu an reddedilmiş kulüp bulunmamaktadır."}
                        {!searchQuery && activeTab === "all" && "Şu an hiç kulüp bulunmamaktadır."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedClubs.map((club) => (
                            <div key={club.id} className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-100 hover:border-indigo-300 hover:shadow-lg transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">{club.name}</h3>
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(club.status)}`}>
                                        {getStatusText(club.status)}
                                    </span>
                                </div>
                                
                                <p className="text-gray-600 mb-4 text-sm line-clamp-3">{club.description}</p>
                                
                                <div className="flex justify-between items-center text-sm text-gray-500 mb-4 pb-4 border-b">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {club.ownerUsername}
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {club.memberCount} üye
                                    </div>
                                </div>

                                <div className="text-sm text-gray-500 mb-4">
                                    <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(club.createdAt)}
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    {/* Onay butonu - her zaman göster ama duruma göre farklı davran */}
                                    {club.status !== "APPROVED" && (
                                        <button
                                            onClick={() => handleApprove(club.id)}
                                            disabled={isApproving}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {club.status === "PENDING" ? "Onayla" : "Onayla"}
                                        </button>
                                    )}
                                    {/* Red butonu - her zaman göster */}
                                    {club.status !== "REJECTED" && (
                                        <button
                                            onClick={() => handleReject(club.id)}
                                            disabled={isRejecting}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {club.status === "PENDING" ? "Reddet" : "Reddet"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
}
