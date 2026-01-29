import { useManagedClubs } from "../../features/club/hooks/useClub";
import ClubManager from "../../features/club/components/ClubManager";

export default function DashboardPage() {
    const { data: managedClubs, isLoading } = useManagedClubs();

    if (isLoading) {
        return <div className="flex justify-center p-8">Yükleniyor...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Kulüp Yönetimi</h1>

            <div className="mb-12">
                {managedClubs && managedClubs.length > 0 ? (
                    <div className="space-y-8">
                        {managedClubs.map(club => (
                            <ClubManager key={club.id} club={club} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Yönetim yetkiniz olan bir kulüp bulunmamaktadır.</p>
                )}
            </div>
        </div>
    );
}
