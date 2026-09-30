import { client } from "../amplifyClient";
import { validateProject } from "../validation/projectValidation";
import { useToast } from "../../context/ToastContext";

export function ProjectRepository() {
    const toast = useToast();

    return {
        async create(input: { name: string; description?: string }) {
            const validation = validateProject(input);
            if (!validation.valid) {
                validation.errors.forEach((e) => toast.error(e));
                return null;
            }

            try {
                const result = await client.models.Project.create(input);
                toast.success("Project created");
                return result;
            } catch (err: any) {
                toast.error(err.message || "Failed to create project");
                return null;
            }
        },

        async update(input: { id: string; name: string; description?: string }) {
            const validation = validateProject(input);
            if (!validation.valid) {
                validation.errors.forEach((e) => toast.error(e));
                return null;
            }

            try {
                const result = await client.models.Project.update(input);
                toast.success("Project updated");
                return result;
            } catch (err: any) {
                toast.error(err.message || "Failed to update project");
                return null;
            }
        },

        async delete(id: string) {
            try {
                await client.models.Project.delete({ id });
                toast.success("Project deleted");
                return true;
            } catch (err: any) {
                toast.error(err.message || "Failed to delete project");
                return false;
            }
        },
    };
}
