import { client } from "../amplifyClient";
import { validateIssue, validateIssueUpdate } from "../validation/issueValidation";
import { useToast } from "../../context/ToastContext";

export function IssueRepository() {
    const toast = useToast();

    return {
        async create(input: {
            title: string;
            description?: string;
            status: string;
            projectId: string;
            sprintId?: string | null;
            assigneeProfileId?: string | null;
        }) {
            const validation = validateIssue(input);
            if (!validation.valid) {
                validation.errors.forEach((e) => toast.error(e));
                return null;
            }

            try {
                const result = await client.models.Issue.create({
                    ...input,
                    status: input.status as "TODO" | "IN_PROGRESS" | "DONE",
                });
                toast.success("Issue created");
                return result;
            } catch (err: any) {
                toast.error(err.message || "Failed to create issue");
                return null;
            }
        },

        async update(input: {
            id: string;
            title?: string;
            description?: string;
            status?: string;
            sprintId?: string | null;
            assigneeProfileId?: string | null;
        }) {
            const validation = validateIssueUpdate({
                title: input.title,
                description: input.description,
                status: input.status,
                sprintId: input.sprintId,
                assigneeProfileId: input.assigneeProfileId,
            });

            if (!validation.valid) {
                validation.errors.forEach((e) => toast.error(e));
                return null;
            }

            try {
                const result = await client.models.Issue.update({
                    ...input,
                    status: input.status as "TODO" | "IN_PROGRESS" | "DONE" | undefined,
                });
                toast.success("Issue updated");
                return result;
            } catch (err: any) {
                toast.error(err.message || "Failed to update issue");
                return null;
            }
        },

        async delete(id: string) {
            try {
                await client.models.Issue.delete({ id });
                toast.success("Issue deleted");
                return true;
            } catch (err: any) {
                toast.error(err.message || "Failed to delete issue");
                return false;
            }
        },
    };
}
