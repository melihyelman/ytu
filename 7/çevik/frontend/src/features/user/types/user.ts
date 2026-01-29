export type User = {
    id: number;
    username: string;
    email: string | null;
    phone?: string | null;
    department?: string | null;
    classYear?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    age?: number | null;
    hobby?: string | null;
    roleId: number;
    createdAt: string;
};

