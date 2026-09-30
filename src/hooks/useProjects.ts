import { useEffect, useState } from "react";
import { client, type Schema } from "../services/amplifyClient";

export function useProjects() {
    const [projects, setProjects] = useState<Schema["Project"]["type"][]>([]);

    useEffect(() => {
        const sub = client.models.Project.observeQuery().subscribe({
            next: ({ items }) => setProjects([...items]),
        });
        return () => sub.unsubscribe();
    }, []);

    return projects;
}
