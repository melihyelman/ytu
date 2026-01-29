import { useNavigate } from "react-router";

export default function AdminPanel() {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                    onClick={() => navigate(`/admin/users`)}
                    className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition cursor-pointer group flex flex-col items-center justify-center h-48"
                >
                    <div className="p-3 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Kullanıcılar</h2>
                    <p className="text-gray-500 text-center text-sm">Kullanıcıları görüntüle ve yönet</p>
                </div>
                
                <div 
                    onClick={() => navigate(`/admin/clubs`)}
                    className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition cursor-pointer group flex flex-col items-center justify-center h-48"
                >
                    <div className="p-3 bg-emerald-100 rounded-full mb-3 group-hover:bg-emerald-200 transition">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Kulüp Yönetimi</h2>
                    <p className="text-gray-500 text-center text-sm">Kulüp taleplerini onayla veya reddet</p>
                </div>

                <div 
                    onClick={() => navigate(`/admin/events`)}
                    className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition cursor-pointer group flex flex-col items-center justify-center h-48"
                >
                    <div className="p-3 bg-purple-100 rounded-full mb-3 group-hover:bg-purple-200 transition">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Etkinlik Yönetimi</h2>
                    <p className="text-gray-500 text-center text-sm">Etkinlik taleplerini onayla veya reddet</p>
                </div>

                <div 
                    onClick={() => navigate(`/admin/announcements`)}
                    className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition cursor-pointer group flex flex-col items-center justify-center h-48"
                >
                    <div className="p-3 bg-orange-100 rounded-full mb-3 group-hover:bg-orange-200 transition">
                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Duyuru Yönetimi</h2>
                    <p className="text-gray-500 text-center text-sm">Duyuru taleplerini yönet</p>
                </div>

                <div 
                    onClick={() => navigate(`/messages`)}
                    className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition cursor-pointer group flex flex-col items-center justify-center h-48"
                >
                    <div className="p-3 bg-indigo-100 rounded-full mb-3 group-hover:bg-indigo-200 transition">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Mesajlar</h2>
                    <p className="text-gray-500 text-center text-sm">Sistem mesajlarını yönet</p>
                </div>
            </div>
        </div>
    );
}
