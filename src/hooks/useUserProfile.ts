import { useEffect, useState } from "react";
import { client, type Schema } from "../services/amplifyClient";

export function useUserProfiles() {
    const [profiles, setProfiles] = useState<Schema["UserProfile"]["type"][]>([]);

    useEffect(() => {
        const sub = client.models.UserProfile.observeQuery().subscribe({
            next: ({ items }) => setProfiles([...items]),
        });

        return () => sub.unsubscribe();
    }, []);

    return profiles;
}
