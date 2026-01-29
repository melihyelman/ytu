import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CreateAnnouncementInput, createAnnouncementSchema, UpdateAnnouncementInput, updateAnnouncementSchema } from "../types/announcement";
import { useApprovedEvents } from "../../event/hooks/useEvent";

type CreateProps = {
    mode: "create";
    defaultValues?: Partial<CreateAnnouncementInput>;
    onSubmit: (values: CreateAnnouncementInput) => void | Promise<void>;
    submitLabel?: string;
    clubId?: number;
    clubName?: string;
    isAdminMode?: boolean; // Admin duyurusu için
};

type UpdateProps = {
    mode: "update";
    defaultValues?: Partial<UpdateAnnouncementInput>;
    onSubmit: (values: UpdateAnnouncementInput) => void | Promise<void>;
    submitLabel?: string;
};

type Props = CreateProps | UpdateProps;

export default function AnnouncementForm(props: Props) {
    const { defaultValues, submitLabel = "Kaydet", mode } = props;
    const { data: events } = useApprovedEvents();
    const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateAnnouncementInput | UpdateAnnouncementInput>({
        resolver: zodResolver(mode === "create" ? createAnnouncementSchema : updateAnnouncementSchema),
        defaultValues: mode === "create" && props.clubId 
            ? { ...defaultValues, clubId: props.clubId } 
            : defaultValues,
    });

    const markdownContent = watch("detailsMarkdown") || "";

    const handleFormSubmit = (data: CreateAnnouncementInput | UpdateAnnouncementInput) => {
        props.onSubmit(data as any);
    };

    // Kulüp için etkinlikleri filtrele
    const clubEvents = mode === "create" && props.clubId 
        ? events?.filter(e => e.clubId === props.clubId && e.status === 'APPROVED')
        : events;

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {mode === "create" && props.isAdminMode && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Tüm kulüpler ve kullanıcılar için genel sistem duyurusu</p>
                        </div>
                    </div>
                </div>
            )}
            
            {mode === "create" && props.clubName && !props.isAdminMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Duyuru şu kulüp için oluşturulacak:</p>
                            <p className="text-base font-bold text-gray-900">{props.clubName}</p>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Başlık {mode === "create" && <span className="text-red-500">*</span>}
                </label>
                <input
                    {...register("title")}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Duyuru başlığı"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Kısa Açıklama {mode === "create" && <span className="text-red-500">*</span>}
                </label>
                <textarea
                    {...register("description")}
                    rows={3}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Kısa açıklama (listede görünecek)"
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Detaylı Açıklama (Markdown)
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        {showMarkdownPreview ? "Editöre Dön" : "Önizleme"}
                    </button>
                </div>

                {!showMarkdownPreview ? (
                    <>
                        <textarea
                            {...register("detailsMarkdown")}
                            rows={10}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Markdown formatında detaylı açıklama yazabilirsiniz...

# Ana Başlık
## Alt Başlık

**Kalın** metin ve *italik* metin
- Liste item 1
- Liste item 2

[Link](https://example.com)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            <strong>Desteklenen formatlar:</strong> Başlıklar (#), Kalın (**metin**), İtalik (*metin*), 
                            Listeler (-, 1.), Linkler, Resimler, Tablolar, Kod blokları, Alıntılar
                        </p>
                    </>
                ) : (
                    <div className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 min-h-[200px] bg-gray-50 overflow-auto">
                        <div className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-600 prose-code:text-pink-600 prose-pre:bg-gray-900 prose-pre:text-gray-100">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {markdownContent || "*Henüz içerik yok*"}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
                {errors.detailsMarkdown && (
                    <p className="text-red-500 text-sm mt-1">{errors.detailsMarkdown.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Etkinlik (Opsiyonel)
                </label>
                <select
                    {...register("eventId", { 
                        setValueAs: (v) => v === "" ? undefined : Number(v) 
                    })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="">Etkinlik seçilmedi (Genel kulüp duyurusu)</option>
                    {clubEvents?.map((event) => (
                        <option key={event.id} value={event.id}>
                            {event.title}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                    Bir etkinlik seçerseniz duyuru o etkinlikle ilişkilendirilir.
                </p>
                {errors.eventId && <p className="text-red-500 text-sm mt-1">{errors.eventId.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Resim URL</label>
                <input
                    {...register("imageUrl")}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && (
                    <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
                )}
            </div>

            {mode === "update" && (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        {...register("isActive")}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">Aktif</label>
                </div>
            )}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? "Kaydediliyor..." : submitLabel}
                </button>
            </div>
        </form>
    );
}
