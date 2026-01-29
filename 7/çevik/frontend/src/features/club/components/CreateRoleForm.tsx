import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createRoleSchema = z.object({
    name: z.string().min(2, "Rol adı en az 2 karakter olmalıdır"),
    isAdmin: z.boolean().optional(),
});

type CreateRoleInput = z.infer<typeof createRoleSchema>;

type Props = {
    onSubmit: (data: { name: string; isAdmin: boolean }) => void | Promise<void>;
    onCancel: () => void;
};

export default function CreateRoleForm({ onSubmit, onCancel }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateRoleInput>({
        resolver: zodResolver(createRoleSchema),
    });

    return (
        <form onSubmit={handleSubmit((data) => onSubmit({ name: data.name, isAdmin: !!data.isAdmin }))} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Rol Adı</label>
                <input
                    {...register("name")}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Örn: Başkan Yardımcısı"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                <div className="flex items-start">
                    <input
                        id="isAdmin"
                        type="checkbox"
                        {...register("isAdmin")}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
                    />
                    <div className="ml-3">
                        <label htmlFor="isAdmin" className="block text-sm font-medium text-gray-900 flex items-center">
                            <svg className="w-4 h-4 mr-1.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                            </svg>
                            Yönetici Yetkisi Ver
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                            Bu rolü alan kullanıcılar kulüp yönetim sayfasına erişebilir, üye kabul/red edebilir, 
                            rol atayabilir ve etkinlik oluşturabilir.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    İptal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? "Oluşturuluyor..." : "Oluştur"}
                </button>
            </div>
        </form>
    );
}
