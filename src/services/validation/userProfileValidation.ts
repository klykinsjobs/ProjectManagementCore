import {
    validateMinLength,
    validateMaxLength,
    validateEnum,
    combine,
} from "./validate";

export function validateUserProfile(input: {
    displayName: string;
    role: string;
    color: string;
}) {
    return combine(
        validateMinLength(
            input.displayName,
            1,
            "Display name must be at least 1 character long"
        ),
        validateMaxLength(
            input.displayName,
            100,
            "Display name must be less than 100 characters"
        ),
        validateEnum(input.role, ["ADMIN", "MEMBER", "VIEWER"], "Role"),
        validateMinLength(input.color, 1, "Color must be at least 1 character long"),
        validateMaxLength(input.color, 20, "Color must be less than 20 characters")
    );
}
