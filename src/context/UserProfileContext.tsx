import { createContext, useContext, useState } from "react";

type UserProfileContextValue = {
    selectedProfileId: string | null;
    setSelectedProfileId: (id: string | null) => void;
};

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

    return (
        <UserProfileContext.Provider value={{ selectedProfileId, setSelectedProfileId }}>
            {children}
        </UserProfileContext.Provider>
    );
}

export function useUserProfileContext() {
    const ctx = useContext(UserProfileContext);
    if (!ctx) throw new Error("useUserProfileContext must be used within UserProfileProvider");
    return ctx;
}
