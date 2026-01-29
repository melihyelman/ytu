// src/pages/ComingSoon.tsx
import { useMessage } from "../../message/hooks/useMessage";

export default function ComingSoon() {
  const { data: msg, isLoading, error } = useMessage(5);

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-gray-500">Yükleniyor…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-red-600">Mesaj alınamadı.</p>
      </div>
    );
  }

  if(!msg?.status){
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-red-600">Aktif bir mesaj bulunmamaktadir</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center bg-white">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center px-6">

        {msg?.status ? msg.content : ""}
      </h1>
    </main>
  );
}
