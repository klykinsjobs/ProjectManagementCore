import { ReactNode } from "react";
import type { Page } from "../AppShell";

export function AppLayout({
    header,
    children,
    menuOpen,
    onCloseMenu,
    onNavigate,
    selectedProjectId,
    selectedProfileId,
}: {
    header: ReactNode;
    children: ReactNode;
    menuOpen: boolean;
    onCloseMenu: () => void;
    onNavigate: (p: Page) => void;
    selectedProjectId: string | null;
    selectedProfileId: string | null;
}) {
    const hasProfile = !!selectedProfileId;

    return (
        <div className={`layout-root ${menuOpen ? "menu-open" : ""}`}>
            <header className="layout-header">{header}</header>

            <nav className="hamburger-menu">
                <div className="hamburger-menu-content">
                    <h3>Navigation</h3>

                    <button onClick={() => onNavigate("profile")}>Profile</button>

                    {!hasProfile && (
                        <p>Please create or select a profile to access other pages.</p>
                    )}

                    {hasProfile && (
                        <>
                            <button onClick={() => onNavigate("projects")}>Projects</button>
                            <button onClick={() => onNavigate("dashboard")}>Dashboard</button>
                            <button onClick={() => onNavigate("myIssues")}>My Issues</button>

                            {!selectedProjectId && <p>No Project Selected</p>}

                            {selectedProjectId && (
                                <>
                                    <h3>Project</h3>
                                    <button onClick={() => onNavigate("projectDetail")}>
                                        Overview
                                    </button>
                                    <button onClick={() => onNavigate("backlog")}>Backlog</button>
                                    <button onClick={() => onNavigate("sprint")}>Sprints</button>
                                    <button onClick={() => onNavigate("board")}>Scrum Board</button>
                                    <button onClick={() => onNavigate("reports")}>Reports</button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </nav>

            {menuOpen && (
                <button
                    className="menu-overlay"
                    onClick={onCloseMenu}
                    aria-label="Close menu"
                />
            )}

            <main className="layout-main">
                <div className="layout-content">{children}</div>
            </main>
        </div>
    );
}
