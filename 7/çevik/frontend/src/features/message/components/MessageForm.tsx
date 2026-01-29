import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMessageInput, createMessageSchema } from "../types/message";

type Props = {
    defaultValues?: Partial<CreateMessageInput>;
    onSubmit: (values: CreateMessageInput) => void | Promise<void>;
    submitLabel?: string;
};

export default function MessageForm({
    defaultValues,
    onSubmit,
    submitLabel = "Save Template"
}: Props) {

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<CreateMessageInput>({
        resolver: zodResolver(createMessageSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}
            className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Id</label>
                    <input
                    type="number"
                    {...register("id", { valueAsNumber: true })} // <— kritik
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" placeholder="Id"
                    />
                    {errors.id && <p className="text-red-500 text-sm">{errors.id.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">content</label>
                    <input
                    {...register("content")}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" placeholder="content"
                    />
                    {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">status</label>
                    <input
                    type="checkbox"
                    {...register("status")}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" placeholder="status"
                    />
                    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                </div>
                <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                {isSubmitting ? "Saving..." : submitLabel}
            </button>
            


        </form>
    )
}