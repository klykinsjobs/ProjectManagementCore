import { client } from "../amplifyClient";
import { validateSprint } from "../validation/sprintValidation";
import { useToast } from "../../context/ToastContext";

export function SprintRepository() {
    const toast = useToast();

    return {
        async create(input: {
            name: string;
            startDate: string;
            endDate: string;
            projectId: string;
        }) {
            const validation = validateSprint(input);
            if (!validation.valid) {
                validation.errors.forEach((e) => toast.error(e));
                return null;
            }

            try {
                const result = await client.models.Sprint.create(input);
                toast.success("Sprint created");
                return result;
            } catch (err: any) {
                toast.error(err.message || "Failed to create sprint");
                return null;
            }
        },

        async update(input: {
            id: string;
            name: string;
            startDate: string;
            endDate: string;
        }) {
            const validation = validateSprint({
                ...input,
                projectId: "placeholder",
            });

            if (!validation.valid) {
                validation.errors.forEach((e) => toast.error(e));
                return null;
            }

            try {
                const result = await client.models.Sprint.update(input);
                toast.success("Sprint updated");
                return result;
            } catch (err: any) {
                toast.error(err.message || "Failed to update sprint");
                return null;
            }
        },

        async delete(id: string) {
            try {
                await client.models.Sprint.delete({ id });
                toast.success("Sprint deleted");
                return true;
            } catch (err: any) {
                toast.error(err.message || "Failed to delete sprint");
                return false;
            }
        },
    };
}
