import { Section } from "../components/ui/Section";
import { List, ListItem } from "../components/ui/List";
import { Card } from "../components/ui/Card";
import { useIssues } from "../hooks/useIssues";
import { useProjects } from "../hooks/useProjects";
import { useSprints } from "../hooks/useSprints";
import { useUserProfileContext } from "../context/UserProfileContext";
import { useUserProfiles } from "../hooks/useUserProfile";
import { permissionsFor } from "../services/permissions/rolePermissions";
import { IssueRepository } from "../services/repositories/IssueRepository";

export function MyIssuesPage() {
    const { selectedProfileId } = useUserProfileContext();
    const profiles = useUserProfiles();
    const repo = IssueRepository();

    const issues = useIssues(
        selectedProfileId
            ? { assigneeProfileId: { eq: selectedProfileId } }
            : undefined
    );

    const projects = useProjects();
    const sprints = useSprints();

    const currentProfile = profiles.find((p) => p.id === selectedProfileId);
    const perms = permissionsFor(currentProfile?.role);

    if (!selectedProfileId) {
        return (
            <Section title="My Issues">
                <p>Please select a profile to view assigned issues.</p>
            </Section>
        );
    }

    if (!perms.view) {
        return (
            <Section title="My Issues">
                <p>You do not have permission to view issues.</p>
            </Section>
        );
    }

    const updateStatus = async (
        id: string,
        status: "TODO" | "IN_PROGRESS" | "DONE"
    ) => {
        if (!perms.edit) return;
        await repo.update({ id, status });
    };

    const assignSprint = async (id: string, sprintId: string | "") => {
        if (!perms.edit) return;
        await repo.update({
            id,
            sprintId: sprintId || null,
        });
    };

    const grouped: Record<string, typeof issues> = {};
    issues.forEach((i) => {
        const pid = i.projectId ?? "unknown";
        grouped[pid] = grouped[pid] || [];
        grouped[pid].push(i);
    });

    return (
        <Section title="My Issues">
            {issues.length === 0 && <p>You have no assigned issues.</p>}

            {Object.entries(grouped).map(([projectId, projectIssues]) => {
                const project = projects.find((p) => p.id === projectId);

                return (
                    <Card key={projectId}>
                        <h3>{project?.name ?? "Unknown Project"}</h3>

                        <List>
                            {projectIssues.map((i) => (
                                <ListItem key={i.id}>
                                    <div className="issue-row">
                                        <div className="issue-main">
                                            <strong>{i.title}</strong>
                                            {i.description && <p>{i.description}</p>}
                                        </div>

                                        <div className="issue-actions">
                                            <label>
                                                Status:
                                                <select
                                                    value={i.status ?? "TODO"}
                                                    onChange={(e) =>
                                                        updateStatus(
                                                            i.id,
                                                            e.target.value as any
                                                        )
                                                    }
                                                    disabled={!perms.edit}
                                                >
                                                    <option value="TODO">TODO</option>
                                                    <option value="IN_PROGRESS">
                                                        IN PROGRESS
                                                    </option>
                                                    <option value="DONE">DONE</option>
                                                </select>
                                            </label>

                                            <label>
                                                Sprint:
                                                <select
                                                    value={i.sprintId ?? ""}
                                                    onChange={(e) =>
                                                        assignSprint(
                                                            i.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={!perms.edit}
                                                >
                                                    <option value="">Unassigned</option>
                                                    {sprints
                                                        .filter(
                                                            (s) =>
                                                                s.projectId ===
                                                                projectId
                                                        )
                                                        .map((s) => (
                                                            <option
                                                                key={s.id}
                                                                value={s.id}
                                                            >
                                                                {s.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </label>
                                        </div>
                                    </div>
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                );
            })}
        </Section>
    );
}
