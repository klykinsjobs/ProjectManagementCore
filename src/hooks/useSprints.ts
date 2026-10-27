import { useEffect, useState } from "react";
import { client, type Schema } from "../services/amplifyClient";

export function useSprints(filter?: Record<string, any>) {
    const [sprints, setSprints] = useState<Schema["Sprint"]["type"][]>([]);

    useEffect(() => {
        const sub = client.models.Sprint.observeQuery({ filter }).subscribe({
            next: ({ items }) => setSprints([...items]),
        });

        return () => sub.unsubscribe();
    }, [JSON.stringify(filter)]);

    return sprints;
}
