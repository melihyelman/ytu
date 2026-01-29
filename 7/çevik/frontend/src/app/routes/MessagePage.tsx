import { useState } from "react";
import { useCreateMessage, useDeleteMessage, useMessage, useMessages, useUpdateMessage } from "../../features/message/hooks/useMessage";
import { CreateMessageInput, MessageDTO } from "../../features/message/types/message";
import { useNavigate } from "react-router";
import Modal from "../../components/ui/Modal";
import MessageForm from "../../features/message/components/MessageForm";

export default function MessagePage() {

    const navigate = useNavigate();
    const { data: messages, isLoading, error } = useMessages();

    const createMessage = useCreateMessage();
    const deleteMessage = useDeleteMessage();
    const updateMessage = useUpdateMessage();

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<MessageDTO | null>(null);


    if (isLoading) {
        return <div className="flex justify-center p-8">Yükleniyor...</div>;
    }
    if (error) {
        return <div className="flex justify-center p-8 text-red-600">Mesajlar yüklenirken hata oluştu.</div>;
    }

    const handleCreate = async (values: CreateMessageInput) => {
        await createMessage.mutateAsync(values);
        setOpen(false);

    }
    const handleUpdate = async (values: CreateMessageInput) => {
        if (!editing) return;
        await updateMessage.mutateAsync({
            id: editing.id,
            input: values
        });
        setEditing(null);
        setOpen(false);
    };

    const handleDelete = async (message: MessageDTO) => {
        if (window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) {
            await deleteMessage.mutateAsync(message.id)
        }
    }

    const openCreate = () => {
        setEditing(null);
        setOpen(true);
    }

    const onCloseModal = () => {
        setOpen(false);
        setEditing(null);
    }

    const openEdit = (message: MessageDTO) => {
        setEditing(message);
        setOpen(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mesaj Yönetimi</h1>
                <div className="flex items-center gap-2">

                <button
                    onClick={() => navigate("/admin")}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                    ← Admin Paneline Dön
                </button>
                <button
                    onClick={openCreate}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Yeni Mesaj Oluştur
                </button>
                </div>
            </div>

            <Modal
                open={open}
                onClose={onCloseModal}
                title={editing ? "Mesajı Güncelle" : "Yeni Mesaj"}
            >
                <MessageForm
                    defaultValues={
                        editing
                            ? { id: editing.id, content: editing.content, status: editing.status }
                            : undefined
                    }
                    onSubmit={editing ? handleUpdate : handleCreate}
                    submitLabel={editing ? "Güncelle" : "Oluştur"}
                />
            </Modal>

            {!messages || messages.length === 0 ? (
                <p className="text-gray-500">Mesaj bulunamadı.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            onClick={() => openEdit(message)}
                            className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition cursor-pointer group relative"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-bold text-gray-900">#{message.id}</h2>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    message.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {message.status ? 'Aktif' : 'Pasif'}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-3">{message.content}</p>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(message);
                                }}
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                            >
                                Sil
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
