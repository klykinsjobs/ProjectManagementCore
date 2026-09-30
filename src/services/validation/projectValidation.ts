import {
    validateMinLength,
    validateMaxLength,
    combine,
} from "./validate";

export function validateProject(input: {
    name: string;
    description?: string;
}) {
    return combine(
        validateMinLength(input.name, 1, "Name must be at least 1 character long"),
        validateMaxLength(input.name, 100, "Name must be less than 100 characters"),
        input.description
            ? validateMaxLength(
                  input.description,
                  1000,
                  "Description must be less than 1000 characters"
              )
            : []
    );
}
