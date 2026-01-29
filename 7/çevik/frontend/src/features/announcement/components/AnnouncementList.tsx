import { useState, useMemo } from "react";
import { 
    useAnnouncements,
    usePendingAnnouncements, 
    useDeleteAnnouncement, 
    useCreateAnnouncement, 
    useUpdateAnnouncement,
    useApproveAnnouncement,
    useRejectAnnouncement
} from "../hooks/useAnnouncement";
import { AnnouncementDTO, CreateAnnouncementInput, UpdateAnnouncementInput } from "../types/announcement";
import AnnouncementForm from "./AnnouncementForm";
import AnnouncementGridList from "./AnnouncementGridList";
import AnnouncementDetailModal from "./AnnouncementDetailModal";
import Modal from "../../../components/ui/Modal";
import AdminListControls from "../../../components/ui/AdminListControls";
import { useNavigate } from "react-router";

export default function AnnouncementList() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementDTO | null>(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementDTO | null>(null);
    const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
    
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
    
    const { data: allAnnouncements, isLoading: loadingAll } = useAnnouncements();
    const { data: pendingAnnouncements, isLoading: loadingPending } = usePendingAnnouncements();
    const { mutateAsync: deleteAnnouncement } = useDeleteAnnouncement();
    const { mutateAsync: createAnnouncement, isPending: isCreating } = useCreateAnnouncement();
    const { mutateAsync: updateAnnouncement, isPending: isUpdating } = useUpdateAnnouncement();
    const { mutateAsync: approveAnnouncement } = useApproveAnnouncement();
    const { mutateAsync: rejectAnnouncement } = useRejectAnnouncement();

    const navigate = useNavigate();

    // Filter, Search, Sort
    const filteredAndSortedAnnouncements = useMemo(() => {
        let result: AnnouncementDTO[] = [];
        
        // Tab filter
        switch (activeTab) {
            case "pending":
                result = pendingAnnouncements || [];
                break;
            case "approved":
                result = (allAnnouncements || []).filter((a: AnnouncementDTO) => a.approvalStatus === "APPROVED");
                break;
            case "rejected":
                result = (allAnnouncements || []).filter((a: AnnouncementDTO) => a.approvalStatus === "REJECTED");
                break;
            case "all":
                result = allAnnouncements || [];
                break;
            default:
                result = pendingAnnouncements || [];
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter((a: AnnouncementDTO) => 
                a.title?.toLowerCase().includes(query) ||
                a.description?.toLowerCase().includes(query)
            );
        }

        // Sort
        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case "date-desc":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "date-asc":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "title-asc":
                    return (a.title || "").localeCompare(b.title || "", "tr");
                case "title-desc":
                    return (b.title || "").localeCompare(a.title || "", "tr");
                default:
                    return 0;
            }
        });

        return result;
    }, [allAnnouncements, pendingAnnouncements, activeTab, searchQuery, sortBy]);

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

    const handleDelete = async (id: number) => {
        if (window.confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) {
            try {
                await deleteAnnouncement(id);
                alert("Duyuru başarıyla silindi");
            } catch (error) {
                console.error("Duyuru silinirken hata oluştu:", error);
                alert("Duyuru silinirken bir hata oluştu");
            }
        }
    };

    const handleCreate = async (values: CreateAnnouncementInput) => {
        try {
            await createAnnouncement(values);
            setIsCreateModalOpen(false);
            alert("Duyuru başarıyla oluşturuldu");
        } catch (error) {
            console.error("Duyuru oluşturulurken hata oluştu:", error);
            alert("Duyuru oluşturulurken bir hata oluştu");
        }
    };

    const handleUpdate = async (values: UpdateAnnouncementInput) => {
        if (!editingAnnouncement) return;
        
        try {
            await updateAnnouncement({
                id: editingAnnouncement.id,
                input: values,
            });
            setEditingAnnouncement(null);
            alert("Duyuru başarıyla güncellendi");
        } catch (error) {
            console.error("Duyuru güncellenirken hata oluştu:", error);
            alert("Duyuru güncellenirken bir hata oluştu");
        }
    };

    const handleApprove = async (id: number) => {
        if (!confirm("Bu duyuruyu onaylamak istediğinize emin misiniz?")) return;
        try {
            await approveAnnouncement(id);
            alert("Duyuru onaylandı!");
        } catch (error: any) {
            console.error("Onaylama hatası:", error);
            alert(error.response?.data?.message || "Duyuru onaylanırken bir hata oluştu");
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm("Bu duyuruyu reddetmek istediğinize emin misiniz?")) return;
        try {
            await rejectAnnouncement(id);
            alert("Duyuru reddedildi");
        } catch (error: any) {
            console.error("Reddetme hatası:", error);
            alert(error.response?.data?.message || "Duyuru reddedilirken bir hata oluştu");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Duyuru Yönetimi</h1>
                    <p className="text-gray-600 mt-1">Bekleyen duyuru taleplerini onaylayın veya reddedin</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate("/admin")}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        ← Admin Paneline Dön
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Admin Duyurusu Oluştur
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
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
                        {pendingAnnouncements && pendingAnnouncements.length > 0 && (
                            <span className="ml-2 bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-full text-xs font-semibold">
                                {pendingAnnouncements.length}
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
                        Onaylanan Duyurular
                    </button>
                    <button
                        onClick={() => handleTabChange("rejected")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "rejected"
                                ? "border-red-500 text-red-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Reddedilen Duyurular
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
                searchPlaceholder="Duyuru başlığı veya açıklama ile ara..."
                sortBy={sortBy}
                onSortChange={handleSortChange}
                sortOptions={sortOptions}
                totalCount={allAnnouncements?.length}
                filteredCount={filteredAndSortedAnnouncements.length}
            />

            {/* Duyuru Listesi */}
            <div>
                <AnnouncementGridList
                    announcements={filteredAndSortedAnnouncements}
                    loading={isLoading}
                    emptyMessage={
                        searchQuery ? "Arama kriterlerine uygun duyuru bulunamadı." :
                        activeTab === "pending" ? "Şu an bekleyen duyuru talebi bulunmamaktadır." :
                        activeTab === "approved" ? "Şu an onaylanmış duyuru bulunmamaktadır." :
                        activeTab === "rejected" ? "Şu an reddedilmiş duyuru bulunmamaktadır." :
                        "Şu an hiç duyuru bulunmamaktadır."
                    }
                    onEdit={setEditingAnnouncement}
                    onDelete={handleDelete}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onClick={setSelectedAnnouncement}
                    showAdminActions={true}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Create Modal - Admin Duyurusu */}
            <Modal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Yeni Admin Duyurusu Oluştur"
            >
                <AnnouncementForm
                    mode="create"
                    isAdminMode={true}
                    onSubmit={handleCreate}
                    submitLabel={isCreating ? "Oluşturuluyor..." : "Oluştur"}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                open={!!editingAnnouncement}
                onClose={() => setEditingAnnouncement(null)}
                title="Duyuru Düzenle"
            >
                {editingAnnouncement && (
                    <AnnouncementForm
                        mode="update"
                        onSubmit={handleUpdate}
                        submitLabel={isUpdating ? "Güncelleniyor..." : "Güncelle"}
                        defaultValues={{
                            title: editingAnnouncement.title,
                            description: editingAnnouncement.description,
                            detailsMarkdown: editingAnnouncement.detailsMarkdown,
                            imageUrl: editingAnnouncement.imageUrl,
                            eventId: editingAnnouncement.eventId,
                            isActive: editingAnnouncement.isActive,
                        }}
                    />
                )}
            </Modal>

            {/* Detail Modal - Duyuru İçeriğini Görmek İçin */}
            <AnnouncementDetailModal
                announcement={selectedAnnouncement}
                onClose={() => setSelectedAnnouncement(null)}
            />
        </div>
    );
}
