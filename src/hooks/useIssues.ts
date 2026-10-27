import { useEffect, useState } from "react";
import { client, type Schema } from "../services/amplifyClient";

export function useIssues(filter?: Record<string, any>) {
    const [issues, setIssues] = useState<Schema["Issue"]["type"][]>([]);

    useEffect(() => {
        const sub = client.models.Issue.observeQuery({ filter }).subscribe({
            next: ({ items }) => setIssues([...items]),
        });

        return () => sub.unsubscribe();
    }, [JSON.stringify(filter)]);

    return issues;
}
