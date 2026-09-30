import { useState } from "react";
import { AppShell, Page } from "./components/AppShell";
import { ProjectProvider } from "./context/ProjectContext";
import { UserProfileProvider } from "./context/UserProfileContext";

import { DashboardPage } from "./pages/DashboardPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { BacklogPage } from "./pages/BacklogPage";
import { SprintPage } from "./pages/SprintPage";
import { BoardPage } from "./pages/BoardPage";
import { ReportsPage } from "./pages/ReportsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MyIssuesPage } from "./pages/MyIssuesPage";

function PageRenderer({ page, goToPage }: { page: Page; goToPage: (p: Page) => void }) {
    switch (page) {
        case "dashboard":
            return <DashboardPage />;
        case "projects":
            return <ProjectsPage goToPage={goToPage} />;
        case "projectDetail":
            return <ProjectDetailPage goToPage={goToPage} />;
        case "backlog":
            return <BacklogPage />;
        case "sprint":
            return <SprintPage />;
        case "board":
            return <BoardPage />;
        case "reports":
            return <ReportsPage />;
        case "profile":
            return <ProfilePage />;
        case "myIssues":
            return <MyIssuesPage />;
        default:
            return <ProfilePage />;
    }
}

export default function App() {
    const [page, setPage] = useState<Page>("dashboard");

    return (
        <UserProfileProvider>
            <ProjectProvider>
                <AppShell onNavigate={setPage}>
                    <PageRenderer page={page} goToPage={setPage} />
                </AppShell>
            </ProjectProvider>
        </UserProfileProvider>
    );
}
