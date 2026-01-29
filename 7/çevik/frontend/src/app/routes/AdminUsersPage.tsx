import { useNavigate } from "react-router";
import UserList from "../../features/user/components/UserList";

export default function AdminUsersPage() {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanıcı Yönetimi</h1>
                    <p className="text-gray-600">Sistemdeki tüm kullanıcıları görüntüleyin ve yönetin</p>
                </div>
                <button
                    onClick={() => navigate("/admin")}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                    ← Admin Paneline Dön
                </button>
            </div>

            <UserList />
        </div>
    );
}

