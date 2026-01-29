import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser, UpdateUserRequest } from "../../features/user/api/userApi";
import { useAuthUser } from "../../features/auth/hooks/useAuth";
import { useJoinedClubs } from "../../features/club/hooks/useClub";
import { useMyParticipations } from "../../features/event/hooks/useEvent";
import { isAdmin } from "../../features/auth/utils/isAdmin";
import Modal from "../../components/ui/Modal";

export default function UserProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userId = parseInt(id || "0", 10);
    const queryClient = useQueryClient();
    
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        department: "",
        classYear: "",
        firstName: "",
        lastName: "",
        age: 0,
        hobby: "",
    });
    
    const { data: currentUser } = useAuthUser();
    const { data: user, isLoading: userLoading } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    });

    const { data: joinedClubs = [] } = useJoinedClubs();
    const { data: participatedEvents = [] } = useMyParticipations();

    const updateUserMutation = useMutation({
        mutationFn: (data: UpdateUserRequest) => updateUser(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", userId] });
            queryClient.invalidateQueries({ queryKey: ["me"] });
            setEditModalOpen(false);
            alert("Profil başarıyla güncellendi!");
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "Profil güncellenirken bir hata oluştu");
        },
    });

    const handleEditClick = () => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                department: user.department || "",
                classYear: user.classYear || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                age: user.age || 0,
                hobby: user.hobby || "",
            });
            setEditModalOpen(true);
        }
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updateData: UpdateUserRequest = {};
        
        if (formData.username && formData.username !== user?.username) {
            updateData.username = formData.username;
        }
        if (formData.email && formData.email !== user?.email) {
            updateData.email = formData.email;
        }
        if (formData.phone !== user?.phone) {
            updateData.phone = formData.phone || undefined;
        }
        if (formData.department !== user?.department) {
            updateData.department = formData.department || undefined;
        }
        if (formData.classYear !== user?.classYear) {
            updateData.classYear = formData.classYear || undefined;
        }
        if (formData.firstName !== user?.firstName) {
            updateData.firstName = formData.firstName || undefined;
        }
        if (formData.lastName !== user?.lastName) {
            updateData.lastName = formData.lastName || undefined;
        }
        if (formData.age !== user?.age) {
            updateData.age = formData.age || undefined;
        }
        if (formData.hobby !== user?.hobby) {
            updateData.hobby = formData.hobby || undefined;
        }

        if (Object.keys(updateData).length === 0) {
            alert("Hiçbir değişiklik yapılmadı");
            return;
        }

        updateUserMutation.mutate(updateData);
    };

    const isLoading = userLoading;

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

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Kullanıcı bulunamadı</h2>
                    <button
                        onClick={() => navigate("/")}
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        Ana sayfaya dön
                    </button>
                </div>
            </div>
        );
    }

    const canEdit = currentUser && (currentUser.id === userId || isAdmin(currentUser));

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
                            
                            {(user.firstName || user.lastName) && (
                                <p className="text-xl text-gray-700">
                                    {user.firstName} {user.lastName}
                                </p>
                            )}
                            
                            <div className="space-y-2">
                                {user.email && (
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {user.email}
                                    </p>
                                )}
                                {user.phone && (
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {user.phone}
                                    </p>
                                )}
                                {user.department && (
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        {user.department}
                                    </p>
                                )}
                                {user.classYear && (
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Sınıf {user.classYear}
                                    </p>
                                )}
                                {user.age && (
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {user.age} yaşında
                                    </p>
                                )}
                                {user.hobby && (
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {user.hobby}
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
                                <span className="flex items-center gap-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Katılma: {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    user.roleId === 1 
                                        ? "bg-purple-100 text-purple-800 border border-purple-200" 
                                        : "bg-blue-100 text-blue-800 border border-blue-200"
                                }`}>
                                    {user.roleId === 1 ? "👑 Admin" : "👤 Kullanıcı"}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {canEdit && (
                        <button
                            onClick={handleEditClick}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Düzenle
                        </button>
                    )}
                </div>
            </div>

            {/* Clubs Section */}
            { (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Üye Olunan Kulüpler ({joinedClubs.length})
                    </h2>
                    
                    {joinedClubs.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-gray-500 text-lg mb-4">Henüz herhangi bir kulübe üye değilsiniz</p>
                            <button
                                onClick={() => navigate("/clubs")}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Kulüpleri Keşfet
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {joinedClubs.map((club) => (
                                <div
                                    key={club.id}
                                    onClick={() => navigate(`/clubs/${club.id}`)}
                                    className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">{club.name}</h3>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {club.memberCount} üye
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{club.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Participated Events Section */}
            {participatedEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Katılınılan Etkinlikler ({participatedEvents.length})
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {participatedEvents.map((event) => (
                            <div
                                key={event.id}
                                onClick={() => navigate(`/events/${event.id}`)}
                                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        event.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        event.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {event.status === 'APPROVED' ? 'Onaylandı' : 
                                         event.status === 'PENDING' ? 'Beklemede' : 'Reddedildi'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(event.eventDate).toLocaleDateString("tr-TR")}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        {event.clubName}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            <Modal
                open={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Profil Düzenle"
            >
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Kullanıcı Adı
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            E-posta
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Telefon
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="0555 123 45 67"
                        />
                    </div>

                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                            Bölüm
                        </label>
                        <input
                            type="text"
                            id="department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Bilgisayar Mühendisliği"
                        />
                    </div>

                    <div>
                        <label htmlFor="classYear" className="block text-sm font-medium text-gray-700 mb-2">
                            Sınıf
                        </label>
                        <input
                            type="text"
                            id="classYear"
                            value={formData.classYear}
                            onChange={(e) => setFormData({ ...formData, classYear: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="2"
                        />
                    </div>

                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            İsim
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Ahmet"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Soyisim
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Yılmaz"
                        />
                    </div>

                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                            Yaş
                        </label>
                        <input
                            type="number"
                            id="age"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="20"
                            min="0"
                        />
                    </div>

                    <div>
                        <label htmlFor="hobby" className="block text-sm font-medium text-gray-700 mb-2">
                            Hobi
                        </label>
                        <input
                            type="text"
                            id="hobby"
                            value={formData.hobby}
                            onChange={(e) => setFormData({ ...formData, hobby: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Futbol, Kitap okumak, Müzik"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={updateUserMutation.isPending}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                        >
                            {updateUserMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditModalOpen(false)}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            İptal
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
