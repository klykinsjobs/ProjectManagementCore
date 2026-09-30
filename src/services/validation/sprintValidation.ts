import {
    validateMinLength,
    validateMaxLength,
    validateDate,
    validateRequired,
    combine,
} from "./validate";

export function validateSprint(input: {
    name: string;
    startDate: string;
    endDate: string;
    projectId: string;
}) {
    return combine(
        validateMinLength(input.name, 1, "Name must be at least 1 character long"),
        validateMaxLength(input.name, 100, "Name must be less than 100 characters"),
        validateDate(input.startDate, "Start date"),
        validateDate(input.endDate, "End date"),
        validateRequired(input.projectId, "Project ID")
    );
}
