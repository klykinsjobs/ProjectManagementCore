import {
    validateMinLength,
    validateMaxLength,
    validateEnum,
    validateRequired,
    combine,
} from "./validate";

export function validateIssue(input: {
    title: string;
    description?: string;
    status: string;
    projectId: string;
    sprintId?: string | null;
    assigneeProfileId?: string | null;
}) {
    return combine(
        validateMinLength(input.title, 1, "Title must be at least 1 character long"),
        validateMaxLength(input.title, 100, "Title must be less than 100 characters"),
        input.description
            ? validateMaxLength(
                input.description,
                1000,
                "Description must be less than 1000 characters"
            )
            : [],
        validateEnum(input.status, ["TODO", "IN_PROGRESS", "DONE"], "Status"),
        validateRequired(input.projectId, "Project ID")
    );
}

export function validateIssueUpdate(input: {
    title?: string;
    description?: string;
    status?: string;
    sprintId?: string | null;
    assigneeProfileId?: string | null;
}) {
    return combine(
        input.title !== undefined
            ? validateMinLength(input.title, 1, "Title must be at least 1 character long")
            : [],
        input.title !== undefined
            ? validateMaxLength(input.title, 100, "Title must be less than 100 characters")
            : [],
        input.description !== undefined && input.description !== null
            ? validateMaxLength(
                input.description,
                1000,
                "Description must be less than 1000 characters"
            )
            : [],
        input.status !== undefined
            ? validateEnum(input.status, ["TODO", "IN_PROGRESS", "DONE"], "Status")
            : []
    );
}
