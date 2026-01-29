import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CreateEventInput, createEventSchema, UpdateEventInput, updateEventSchema } from "../types/event";

type CreateProps = {
    mode: "create";
    defaultValues?: Partial<CreateEventInput>;
    onSubmit: (values: CreateEventInput) => void | Promise<void>;
    submitLabel?: string;
    clubId?: number;
};

type UpdateProps = {
    mode: "update";
    defaultValues?: Partial<UpdateEventInput>;
    onSubmit: (values: UpdateEventInput) => void | Promise<void>;
    submitLabel?: string;
};

type Props = CreateProps | UpdateProps;

export default function EventForm(props: Props) {
    const { defaultValues, submitLabel = "Kaydet", mode } = props;
    const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateEventInput | UpdateEventInput>({
        resolver: zodResolver(mode === "create" ? createEventSchema : updateEventSchema),
        defaultValues: mode === "create" && props.clubId 
            ? { ...defaultValues, clubId: props.clubId } 
            : defaultValues,
    });

    const markdownContent = watch("detailsMarkdown") || "";

    const handleFormSubmit = (data: CreateEventInput | UpdateEventInput) => {
        props.onSubmit(data as any);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Başlık {mode === "create" && <span className="text-red-500">*</span>}
                </label>
                <input
                    {...register("title")}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Etkinlik başlığı"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Açıklama {mode === "create" && <span className="text-red-500">*</span>}
                </label>
                <textarea
                    {...register("description")}
                    rows={3}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Kısa açıklama"
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
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        {showMarkdownPreview ? "Editöre Dön" : "Önizleme"}
                    </button>
                </div>

                {!showMarkdownPreview ? (
                    <>
                        <textarea
                            {...register("detailsMarkdown")}
                            rows={10}
                            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Markdown formatında detaylı açıklama yazabilirsiniz...

Örnek:
# Ana Başlık
## Alt Başlık

**Kalın** metin ve *italik* metin
- Liste item 1
- Liste item 2

1. Numaralı liste
2. İkinci item

[Link](https://example.com)
![Resim](https://example.com/image.jpg)

> Alıntı metni

\`kod\` ve kod blokları için:
\`\`\`
kod bloğu
\`\`\`

Tablo:
| Başlık 1 | Başlık 2 |
|----------|----------|
| Hücre 1  | Hücre 2  |"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            <strong>Desteklenen formatlar:</strong> Başlıklar (#), Kalın (**metin**), İtalik (*metin*), 
                            Listeler (-, 1.), Linkler, Resimler, Tablolar, Kod blokları, Alıntılar
                        </p>
                    </>
                ) : (
                    <div className="mt-1 block w-full rounded border border-gray-300 px-4 py-3 min-h-[200px] bg-gray-50 overflow-auto">
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
                    Etkinlik Tarihi {mode === "create" && <span className="text-red-500">*</span>}
                </label>
                <input
                    type="datetime-local"
                    {...register("eventDate")}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.eventDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Lokasyon</label>
                <input
                    {...register("location")}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Etkinlik yeri"
                />
                {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Kapasite</label>
                <input
                    type="number"
                    {...register("capacity", { valueAsNumber: true })}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Maksimum katılımcı sayısı"
                />
                {errors.capacity && (
                    <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Resim URL</label>
                <input
                    {...register("imageUrl")}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && (
                    <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
                )}
            </div>

            {mode === "create" && (
                <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                    <div className="flex items-start">
                        <input
                            id="isClubExclusive"
                            type="checkbox"
                            {...register("isClubExclusive")}
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
                        />
                        <div className="ml-3">
                            <label htmlFor="isClubExclusive" className="block text-sm font-medium text-gray-900 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Kulübe Özel Etkinlik
                            </label>
                            <p className="text-xs text-gray-600 mt-1">
                                Bu seçenek işaretlenirse, sadece kulüp üyeleri bu etkinliği görebilir ve katılabilir.
                                İşaretlenmezse herkes görebilir ve katılabilir.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Kaydediliyor..." : submitLabel}
                </button>
            </div>
        </form>
    );
}

