import { useState } from "react";
import { ClubResponse } from "../types/club";
import { useClubMembers, useClubRoles, useApproveMembership, useRejectMembership, useCreateClubRole, useAssignRole, useRemoveMember } from "../hooks/useClub";
import Modal from "../../../components/ui/Modal";
import CreateRoleForm from "./CreateRoleForm";

type Props = {
    club: ClubResponse;
};

export default function ClubManager({ club }: Props) {
    const { data: members, isLoading: membersLoading } = useClubMembers(club.id);
    const { data: roles, isLoading: rolesLoading } = useClubRoles(club.id);
    
    const { mutate: approveMember } = useApproveMembership();
    const { mutate: rejectMember } = useRejectMembership();
    const { mutateAsync: createRole } = useCreateClubRole();
    const { mutate: assignRole } = useAssignRole();
    const { mutate: removeMember, isPending: isRemoving } = useRemoveMember();

    const [isRoleModalOpen, setRoleModalOpen] = useState(false);

    if (membersLoading || rolesLoading) return <div>Yükleniyor...</div>;

    const pendingMembers = members?.filter(m => m.status === 'PENDING') || [];
    const approvedMembers = members?.filter(m => m.status === 'APPROVED') || [];

    const handleCreateRole = async (data: { name: string; isAdmin: boolean }) => {
        try {
            console.log("Creating role with data:", { name: data.name, isAdmin: data.isAdmin, clubId: club.id });
            await createRole({ name: data.name, isAdmin: data.isAdmin, clubId: club.id });
            setRoleModalOpen(false);
        } catch (error) {
            console.error("Role create error", error);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{club.name} Yönetimi</h2>
                <span className={`px-2 py-1 text-xs rounded-full border ${
                    club.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    club.status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200' :
                    'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                    {club.status}
                </span>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Üyelik İstekleri ({pendingMembers.length})</h3>
                {pendingMembers.length === 0 ? (
                    <p className="text-gray-500 text-sm">Bekleyen istek yok.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {pendingMembers.map(member => (
                            <li key={member.id} className="py-4 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-900">{member.username}</p>
                                    <p className="text-sm text-gray-500">Başvuru Tarihi: {new Date(member.joinDate).toLocaleDateString('tr-TR')}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => approveMember(member.id)}
                                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Onayla
                                    </button>
                                    <button
                                        onClick={() => rejectMember(member.id)}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Reddet
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-lg font-semibold">Üyeler ({approvedMembers.length})</h3>
                    <button
                        onClick={() => setRoleModalOpen(true)}
                        className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200"
                    >
                        + Yeni Rol Oluştur
                    </button>
                </div>
                
                {approvedMembers.length === 0 ? (
                    <p className="text-gray-500 text-sm">Henüz üye yok.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {approvedMembers.map(member => (
                                    <tr key={member.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {member.username}
                                            {member.username === club.ownerUsername && <span className="ml-2 text-xs text-gray-500">(Kurucu)</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {member.roleName || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    defaultValue=""
                                                    onChange={(e) => {
                                                        const roleId = Number(e.target.value);
                                                        if (roleId) {
                                                            assignRole({ memberId: member.id, roleId, clubId: club.id });
                                                        }
                                                    }}
                                                >
                                                    <option value="" disabled>Rol Ata</option>
                                                    {roles?.map(role => (
                                                        <option key={role.id} value={role.id}>{role.name}</option>
                                                    ))}
                                                </select>
                                                {/* Kulübün kurucusu çıkartılamaz */}
                                                {member.username !== club.ownerUsername && (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`${member.username} adlı üyeyi kulüpten çıkartmak istediğinize emin misiniz?`)) {
                                                                removeMember({ memberId: member.id, clubId: club.id });
                                                            }
                                                        }}
                                                        disabled={isRemoving}
                                                        className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                                                        title="Üyeyi Çıkart"
                                                    >
                                                        Çıkart
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal
                open={isRoleModalOpen}
                onClose={() => setRoleModalOpen(false)}
                title="Yeni Kulüp Rolü Oluştur"
            >
                <CreateRoleForm
                    onSubmit={handleCreateRole}
                    onCancel={() => setRoleModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
