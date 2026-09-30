import { useState } from "react";
import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";
import { useProjectContext } from "../context/ProjectContext";
import { useIssues } from "../hooks/useIssues";
import { useSprints } from "../hooks/useSprints";
import { useUserProfileContext } from "../context/UserProfileContext";
import { useUserProfiles } from "../hooks/useUserProfile";
import { permissionsFor } from "../services/permissions/rolePermissions";
import { IssueRepository } from "../services/repositories/IssueRepository";

export type IssueStatus = "TODO" | "IN_PROGRESS" | "DONE";

export function BoardPage() {
    const { selectedProjectId } = useProjectContext();
    const { selectedProfileId } = useUserProfileContext();
    const profiles = useUserProfiles();
    const repo = IssueRepository();

    const currentProfile = profiles.find((p) => p.id === selectedProfileId);
    const perms = permissionsFor(currentProfile?.role);

    const sprints = useSprints(
        selectedProjectId ? { projectId: { eq: selectedProjectId } } : undefined
    );

    const issues = useIssues(
        selectedProjectId ? { projectId: { eq: selectedProjectId } } : undefined
    );

    const [selectedSprintId, setSelectedSprintId] = useState<string | "all">("all");

    if (!selectedProfileId) {
        return (
            <Section title="Board">
                <p>Please select a profile before accessing the board.</p>
            </Section>
        );
    }

    if (!perms.view) {
        return (
            <Section title="Board">
                <p>You do not have permission to view the board.</p>
            </Section>
        );
    }

    if (!selectedProjectId) {
        return (
            <Section title="Board">
                <p>No project selected.</p>
            </Section>
        );
    }

    const updateStatus = async (id: string, status: IssueStatus) => {
        if (!perms.edit) return;
        await repo.update({ id, status });
    };

    const filteredIssues =
        selectedSprintId === "all"
            ? issues
            : issues.filter((i) => i.sprintId === selectedSprintId);

    const col = (status: IssueStatus) =>
        filteredIssues.filter((i) => i.status === status);

    return (
        <Section title="Scrum Board">
            <div className="board-sprint-select">
                <label>
                    Sprint:
                    <select
                        value={selectedSprintId}
                        onChange={(e) =>
                            setSelectedSprintId(e.target.value as string | "all")
                        }
                    >
                        <option value="all">All sprints</option>
                        {sprints.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="board-columns">
                <BoardColumn
                    title="TODO"
                    items={col("TODO")}
                    onMove={updateStatus}
                    profiles={profiles}
                    canEdit={perms.edit}
                />
                <BoardColumn
                    title="IN PROGRESS"
                    items={col("IN_PROGRESS")}
                    onMove={updateStatus}
                    profiles={profiles}
                    canEdit={perms.edit}
                />
                <BoardColumn
                    title="DONE"
                    items={col("DONE")}
                    onMove={updateStatus}
                    profiles={profiles}
                    canEdit={perms.edit}
                />
            </div>
        </Section>
    );
}

function BoardColumn({
    title,
    items,
    onMove,
    profiles,
    canEdit,
}: {
    title: string;
    items: any[];
    onMove: (id: string, status: IssueStatus) => void;
    profiles: any[];
    canEdit: boolean;
}) {
    return (
        <Card>
            <h3>{title}</h3>
            <div className="board-column-items">
                {items.map((i) => {
                    const assignee = i.assigneeProfileId
                        ? profiles.find((p) => p.id === i.assigneeProfileId)
                        : null;

                    return (
                        <div key={i.id} className="board-item">
                            <strong>{i.title}</strong>
                            {i.description && <p>{i.description}</p>}
                            {assignee && (
                                <p>
                                    Assignee: {assignee.displayName} ({assignee.role})
                                </p>
                            )}
                            <div className="board-item-status">
                                <select
                                    value={i.status ?? "TODO"}
                                    onChange={(e) =>
                                        onMove(i.id, e.target.value as IssueStatus)
                                    }
                                    disabled={!canEdit}
                                >
                                    <option value="TODO">TODO</option>
                                    <option value="IN_PROGRESS">IN PROGRESS</option>
                                    <option value="DONE">DONE</option>
                                </select>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
