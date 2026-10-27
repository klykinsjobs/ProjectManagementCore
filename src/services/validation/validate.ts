export function validateRequired(value: any, field: string): string[] {
    if (value === undefined || value === null || value === "") {
        return [`${field} is required`];
    }
    return [];
}

export function validateMinLength(value: string, min: number, msg: string): string[] {
    return value.length < min ? [msg] : [];
}

export function validateMaxLength(value: string, max: number, msg: string): string[] {
    return value.length > max ? [msg] : [];
}

export function validateEnum<T extends string>(
    value: string,
    allowed: T[],
    field: string
): string[] {
    return allowed.includes(value as T)
        ? []
        : [`${field} must be one of: ${allowed.join(", ")}`];
}

export function validateDate(value: string, field: string): string[] {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return [`${field} must be a valid date (YYYY-MM-DD)`];
    }
    return [];
}

export function combine(...groups: string[][]): { valid: boolean; errors: string[] } {
    const errors = groups.flat();
    return { valid: errors.length === 0, errors };
}
