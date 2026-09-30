import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";
import { useProjects } from "../hooks/useProjects";
import { useIssues } from "../hooks/useIssues";
import { useSprints } from "../hooks/useSprints";

export function DashboardPage() {
    const projects = useProjects();
    const issues = useIssues();
    const sprints = useSprints();

    const todoCount = issues.filter(i => i.status === "TODO").length;
    const inProgressCount = issues.filter(i => i.status === "IN_PROGRESS").length;
    const doneCount = issues.filter(i => i.status === "DONE").length;

    return (
        <Section title="Dashboard">
            <div className="dashboard-grid">
                <Card>
                    <h3>Projects</h3>
                    <p>Total: {projects.length}</p>
                </Card>

                <Card>
                    <h3>Sprints</h3>
                    <p>Total: {sprints.length}</p>
                </Card>

                <Card>
                    <h3>Issues</h3>
                    <p>TODO: {todoCount}</p>
                    <p>In Progress: {inProgressCount}</p>
                    <p>Done: {doneCount}</p>
                </Card>
            </div>
        </Section>
    );
}
