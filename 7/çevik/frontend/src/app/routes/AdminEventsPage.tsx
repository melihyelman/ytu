import { useState, useMemo } from "react";
import { usePendingEvents, useEvents, useEvent } from "../../features/event/hooks/useEvent";
import EventList from "../../features/event/components/EventList";
import { EventResponse } from "../../features/event/types/event";
import { useNavigate } from "react-router-dom";
import AdminListControls from "../../components/ui/AdminListControls";

export default function AdminEventsPage() {
    const { data: allEvents, isLoading: loadingAll } = useEvents();
    const { data: pendingEvents, isLoading: loadingPending } = usePendingEvents();
    const { approveEvent, rejectEvent, isApproving, isRejecting } = useEvent();
    
    const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
    const navigate = useNavigate();

    // Search, Sort, Pagination states
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "title-asc" | "title-desc">("date-desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const sortOptions = [
        { value: "date-desc", label: "En Yeni" },
        { value: "date-asc", label: "En Eski" },
        { value: "title-asc", label: "Başlık (A-Z)" },
        { value: "title-desc", label: "Başlık (Z-A)" },
    ];

    const handleApprove = async (id: number) => {
        if (!confirm("Bu etkinliği onaylamak istediğinize emin misiniz?")) return;
        try {
            await approveEvent(id);
            alert("Etkinlik onaylandı!");
        } catch (error: any) {
            console.error("Onaylama hatası:", error);
            alert(error.response?.data?.message || "Etkinlik onaylanırken bir hata oluştu");
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm("Bu etkinliği reddetmek istediğinize emin misiniz?")) return;
        try {
            await rejectEvent(id);
            alert("Etkinlik reddedildi");
        } catch (error: any) {
            console.error("Reddetme hatası:", error);
            alert(error.response?.data?.message || "Etkinlik reddedilirken bir hata oluştu");
        }
    };

    const handleDetailClick = (event: EventResponse) => {
        navigate(`/events/${event.id}`);
    };

    // Filter, Search, Sort
    const filteredAndSortedEvents = useMemo(() => {
        let result: EventResponse[] = [];
        
        // Tab filter
        switch (activeTab) {
            case "pending":
                result = pendingEvents || [];
                break;
            case "approved":
                result = (allEvents || []).filter((e: EventResponse) => e.status === "APPROVED");
                break;
            case "rejected":
                result = (allEvents || []).filter((e: EventResponse) => e.status === "REJECTED");
                break;
            case "all":
                result = allEvents || [];
                break;
            default:
                result = pendingEvents || [];
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter((e: EventResponse) => 
                e.title?.toLowerCase().includes(query) ||
                e.description?.toLowerCase().includes(query) ||
                e.location?.toLowerCase().includes(query)
            );
        }

        // Sort
        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case "date-desc":
                    return new Date(b.eventDate || b.createdAt).getTime() - new Date(a.eventDate || a.createdAt).getTime();
                case "date-asc":
                    return new Date(a.eventDate || a.createdAt).getTime() - new Date(b.eventDate || b.createdAt).getTime();
                case "title-asc":
                    return (a.title || "").localeCompare(b.title || "", "tr");
                case "title-desc":
                    return (b.title || "").localeCompare(a.title || "", "tr");
                default:
                    return 0;
            }
        });

        return result;
    }, [allEvents, pendingEvents, activeTab, searchQuery, sortBy]);

    const isLoading = activeTab === "pending" ? loadingPending : loadingAll;

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Etkinlik Yönetimi</h1>
                        <p className="text-gray-600 mt-1">Kulüp yetkilileri tarafından oluşturulan etkinlik taleplerini onaylayın veya reddedin</p>
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
                        {pendingEvents && pendingEvents.length > 0 && (
                            <span className="ml-2 bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-full text-xs font-semibold">
                                {pendingEvents.length}
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
                        Onaylanan Etkinlikler
                    </button>
                    <button
                        onClick={() => handleTabChange("rejected")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "rejected"
                                ? "border-red-500 text-red-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Reddedilen Etkinlikler
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
                searchPlaceholder="Etkinlik başlığı, açıklama veya konum ile ara..."
                sortBy={sortBy}
                onSortChange={handleSortChange}
                sortOptions={sortOptions}
                totalCount={allEvents?.length}
                filteredCount={filteredAndSortedEvents.length}
            />

            {/* Etkinlik Listesi */}
            <EventList
                events={filteredAndSortedEvents}
                loading={isLoading || isApproving || isRejecting}
                emptyMessage={
                    searchQuery ? "Arama kriterlerine uygun etkinlik bulunamadı." :
                    activeTab === "pending" ? "Şu an bekleyen etkinlik talebi bulunmamaktadır." :
                    activeTab === "approved" ? "Şu an onaylanmış etkinlik bulunmamaktadır." :
                    activeTab === "rejected" ? "Şu an reddedilmiş etkinlik bulunmamaktadır." :
                    "Şu an hiç etkinlik bulunmamaktadır."
                }
                onApprove={handleApprove}
                onReject={handleReject}
                onClick={handleDetailClick}
                showAdminActions={true}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
