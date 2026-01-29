import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAllUsers, useDeleteUser, useUpdateUserRole } from "../hooks/useUser";
import { useRoles } from "../../role/hooks/useRole";
import { User } from "../types/user";
import Pagination from "../../../components/ui/Pagination";

export default function UserList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<number | "all">("all");
    const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "username-asc" | "username-desc">("date-desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const { data: users, isLoading: usersLoading, error: usersError } = useAllUsers();
    const { data: roles, isLoading: rolesLoading, error: rolesError } = useRoles();
    const deleteUserMutation = useDeleteUser();
    const updateRoleMutation = useUpdateUserRole();

    // Filter, Search, Sort
    const filteredAndSortedUsers = useMemo(() => {
        let result = users || [];

        // Role filter
        if (roleFilter !== "all") {
            result = result.filter((user: User) => user.roleId === roleFilter);
        }

        // Search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            result = result.filter((user: User) =>
                user.username.toLowerCase().includes(searchLower) || 
                (user.email && user.email.toLowerCase().includes(searchLower))
            );
        }

        // Sort
        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case "date-desc":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "date-asc":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "username-asc":
                    return a.username.localeCompare(b.username, "tr");
                case "username-desc":
                    return b.username.localeCompare(a.username, "tr");
                default:
                    return 0;
            }
        });

        return result;
    }, [users, roleFilter, searchTerm, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
    const paginatedUsers = filteredAndSortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page when filters change
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleRoleFilterChange = (role: number | "all") => {
        setRoleFilter(role);
        setCurrentPage(1);
    };

    const handleSortChange = (sort: string) => {
        setSortBy(sort as typeof sortBy);
        setCurrentPage(1);
    };

    const handleDelete = async (userId: number) => {
        if (window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
            try {
                await deleteUserMutation.mutateAsync(userId);
                alert("Kullanıcı başarıyla silindi");
            } catch (error) {
                console.error("Kullanıcı silinirken hata oluştu:", error);
                alert("Kullanıcı silinirken bir hata oluştu");
            }
        }
    };

    const handleRoleUpdate = async (userId: number, newRoleId: number) => {
        if (!newRoleId) {
            alert("Lütfen geçerli bir rol seçin");
            return;
        }
        try {
            await updateRoleMutation.mutateAsync({ userId, roleId: newRoleId });
            alert("Kullanıcının rolü başarıyla güncellendi");
        } catch (error: any) {
            console.error("Rol güncellenirken hata oluştu:", error);
            alert(error?.response?.data?.message || "Rol güncellenirken bir hata oluştu");
        }
    };

    const getRoleName = (roleId: number) => {
        const role = roles?.find(r => r.id === roleId);
        return role?.name || "Unknown";
    };

    const getRoleColor = (roleId: number) => {
        const role = roles?.find(r => r.id === roleId);
        if (!role) return "bg-gray-100 text-gray-800";
        
        const roleName = role.name.toLowerCase();
        if (roleName.includes("admin")) return "bg-red-100 text-red-800";
        return "bg-green-100 text-green-800";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (usersLoading || rolesLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (usersError || rolesError) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                Veriler yüklenirken bir hata oluştu
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Arama
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Kullanıcı adı veya e-posta ile ara..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div className="min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rol
                        </label>
                        <div className="relative">
                            <select
                                value={roleFilter}
                                onChange={(e) => handleRoleFilterChange(e.target.value === "all" ? "all" : Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 appearance-none cursor-pointer"
                            >
                                <option value="all">Tümü</option>
                                {roles?.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="min-w-[180px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sıralama
                        </label>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 appearance-none cursor-pointer"
                            >
                                <option value="date-desc">En Yeni</option>
                                <option value="date-asc">En Eski</option>
                                <option value="username-asc">Kullanıcı Adı (A-Z)</option>
                                <option value="username-desc">Kullanıcı Adı (Z-A)</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result Count */}
                <div className="mt-3 text-sm text-gray-600">
                    Toplam {users?.length || 0} kayıttan {filteredAndSortedUsers.length} sonuç gösteriliyor
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {paginatedUsers && paginatedUsers.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kullanıcı Adı
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            E-posta
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rol
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Oluşturulma Tarihi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedUsers.map((user: User) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    <button
                                                        onClick={() => navigate(`/users/${user.id}`)}
                                                        className="text-indigo-600 hover:text-indigo-900 hover:underline"
                                                    >
                                                        {user.username}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {user.email || <span className="text-gray-400 italic">E-posta yok</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.roleId)}`}
                                                    >
                                                        {getRoleName(user.roleId)}
                                                    </span>
                                                    <select
                                                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                                        value=""
                                                        onChange={(e) => {
                                                            const newRoleId = Number(e.target.value);
                                                            if (newRoleId && newRoleId !== user.roleId) {
                                                                handleRoleUpdate(user.id, newRoleId);
                                                            }
                                                        }}
                                                        disabled={updateRoleMutation.isPending}
                                                    >
                                                        <option value="">Rol Değiştir</option>
                                                        {roles?.filter(r => r.id !== user.roleId).map(role => (
                                                            <option key={role.id} value={role.id}>{role.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                <button
                                                    onClick={() => navigate(`/users/${user.id}`)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Görüntüle
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={deleteUserMutation.isPending}
                                                    className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                                                >
                                                    Sil
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        {searchTerm || roleFilter !== "all"
                            ? "Arama kriterine uygun kullanıcı bulunamadı"
                            : "Henüz kullanıcı bulunmamaktadır"}
                    </div>
                )}
            </div>
        </div>
    );
}
