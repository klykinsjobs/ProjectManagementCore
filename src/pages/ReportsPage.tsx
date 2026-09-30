import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";
import { List, ListItem } from "../components/ui/List";
import { useProjectContext } from "../context/ProjectContext";
import { useIssues } from "../hooks/useIssues";
import { useSprints } from "../hooks/useSprints";

export function ReportsPage() {
    const { selectedProjectId } = useProjectContext();

    const issues = useIssues(
        selectedProjectId ? { projectId: { eq: selectedProjectId } } : undefined
    );

    const sprints = useSprints(
        selectedProjectId ? { projectId: { eq: selectedProjectId } } : undefined
    );

    if (!selectedProjectId) {
        return <Section title="Reports"><p>No project selected.</p></Section>;
    }

    const todoCount = issues.filter(i => i.status === "TODO").length;
    const inProgressCount = issues.filter(i => i.status === "IN_PROGRESS").length;
    const doneCount = issues.filter(i => i.status === "DONE").length;

    const completion =
        issues.length === 0 ? 0 : Math.round((doneCount / issues.length) * 100);

    const issuesBySprint: Record<string, number> = {};
    issues.forEach((i) => {
        if (!i.sprintId) return;
        issuesBySprint[i.sprintId] = (issuesBySprint[i.sprintId] ?? 0) + 1;
    });

    return (
        <Section title="Reports">
            <div className="reports-grid">
                <Card>
                    <h3>Issue Status Breakdown</h3>
                    <List>
                        <ListItem>TODO: {todoCount}</ListItem>
                        <ListItem>In Progress: {inProgressCount}</ListItem>
                        <ListItem>Done: {doneCount}</ListItem>
                        <ListItem>Completion: {completion}%</ListItem>
                    </List>
                </Card>

                <Card>
                    <h3>Sprint Issue Counts</h3>
                    <List>
                        {sprints.map((s) => (
                            <ListItem key={s.id}>
                                {s.name}: {issuesBySprint[s.id] ?? 0} issues
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </div>
        </Section>
    );
}
