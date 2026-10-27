import { useEffect, useState } from "react";
import { client, type Schema } from "../services/amplifyClient";

export function useProject(projectId: string | null) {
    const [project, setProject] = useState<Schema["Project"]["type"] | null>(null);

    useEffect(() => {
        if (!projectId) return;

        const sub = client.models.Project
            .observeQuery({ filter: { id: { eq: projectId } } })
            .subscribe({
                next: ({ items }) => setProject(items[0] ?? null),
            });

        return () => sub.unsubscribe();
    }, [projectId]);

    return project;
}
