import { ReactNode, useEffect, useState } from "react";
import { useProjectContext } from "../context/ProjectContext";
import { useUserProfileContext } from "../context/UserProfileContext";
import { AppLayout } from "./layout/AppLayout";
import { Header } from "./layout/Header";

export type Page =
    | "dashboard"
    | "projects"
    | "projectDetail"
    | "backlog"
    | "sprint"
    | "board"
    | "reports"
    | "profile"
    | "myIssues";

export function AppShell({
    onNavigate,
    children,
}: {
    onNavigate: (p: Page) => void;
    children: ReactNode;
}) {
    const { selectedProjectId } = useProjectContext();
    const { selectedProfileId } = useUserProfileContext();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!selectedProfileId) {
            onNavigate("profile");
        }
    }, [selectedProfileId, onNavigate]);

    const navigateAndClose = (p: Page) => {
        if (!selectedProfileId && p !== "profile") {
            onNavigate("profile");
            setMenuOpen(false);
            return;
        }

        onNavigate(p);
        setMenuOpen(false);
    };

    return (
        <AppLayout
            header={<Header onToggleMenu={() => setMenuOpen((prev) => !prev)} />}
            menuOpen={menuOpen}
            onCloseMenu={() => setMenuOpen(false)}
            onNavigate={navigateAndClose}
            selectedProjectId={selectedProjectId}
            selectedProfileId={selectedProfileId}
        >
            {children}
        </AppLayout>
    );
}
