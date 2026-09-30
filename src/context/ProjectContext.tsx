import { createContext, useContext, useState } from "react";

type ProjectContextValue = {
    selectedProjectId: string | null;
    setSelectedProjectId: (id: string | null) => void;
};

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    return (
        <ProjectContext.Provider value={{ selectedProjectId, setSelectedProjectId }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjectContext() {
    const ctx = useContext(ProjectContext);
    if (!ctx) throw new Error("useProjectContext must be used within ProjectProvider");
    return ctx;
}
