import type { Schema } from "../../../amplify/data/resource";

export type UserRole = Schema["UserProfile"]["type"]["role"];

export function canView(role: UserRole | null | undefined): boolean {
    return role === "ADMIN" || role === "MEMBER" || role === "VIEWER";
}

export function canCreate(role: UserRole | null | undefined): boolean {
    return role === "ADMIN" || role === "MEMBER";
}

export function canEdit(role: UserRole | null | undefined): boolean {
    return role === "ADMIN" || role === "MEMBER";
}

export function canDelete(role: UserRole | null | undefined): boolean {
    return role === "ADMIN";
}

export function permissionsFor(role: UserRole | null | undefined) {
    return {
        view: canView(role),
        create: canCreate(role),
        edit: canEdit(role),
        delete: canDelete(role),
    };
}
