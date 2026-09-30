import { useState } from "react";
import { Section } from "../components/ui/Section";
import { List, ListItem } from "../components/ui/List";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { TextArea } from "../components/ui/TextArea";
import { FormModal } from "../components/ui/FormModal";
import { useProjectContext } from "../context/ProjectContext";
import { useIssues } from "../hooks/useIssues";
import { useSprints } from "../hooks/useSprints";
import { useUserProfileContext } from "../context/UserProfileContext";
import { useUserProfiles } from "../hooks/useUserProfile";
import { permissionsFor } from "../services/permissions/rolePermissions";
import { IssueRepository } from "../services/repositories/IssueRepository";

export function BacklogPage() {
    const { selectedProjectId } = useProjectContext();
    const { selectedProfileId } = useUserProfileContext();
    const profiles = useUserProfiles();
    const repo = IssueRepository();

    const currentProfile = profiles.find((p) => p.id === selectedProfileId);
    const perms = permissionsFor(currentProfile?.role);

    const issues = useIssues(
        selectedProjectId ? { projectId: { eq: selectedProjectId } } : undefined
    );
    const sprints = useSprints(
        selectedProjectId ? { projectId: { eq: selectedProjectId } } : undefined
    );

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [draftTitle, setDraftTitle] = useState("");
    const [draftDescription, setDraftDescription] = useState("");
    const [draftAssigneeId, setDraftAssigneeId] = useState<string | "">("");
    const [editingIssue, setEditingIssue] = useState<any>(null);

    if (!selectedProfileId) {
        return (
            <Section title="Backlog">
                <p>Please select a profile before accessing project backlog.</p>
            </Section>
        );
    }

    if (!perms.view) {
        return (
            <Section title="Backlog">
                <p>You do not have permission to view the backlog.</p>
            </Section>
        );
    }

    if (!selectedProjectId) {
        return (
            <Section title="Backlog">
                <p>No project selected.</p>
            </Section>
        );
    }

    const openCreate = () => {
        if (!perms.create) return;
        setDraftTitle("");
        setDraftDescription("");
        setDraftAssigneeId("");
        setCreateOpen(true);
    };

    const submitCreate = async () => {
        if (!perms.create) return;
        await repo.create({
            title: draftTitle,
            description: draftDescription,
            status: "TODO",
            projectId: selectedProjectId,
            assigneeProfileId: draftAssigneeId || null,
        });
        setCreateOpen(false);
    };

    const openEdit = (issue: any) => {
        if (!perms.edit) return;
        setEditingIssue(issue);
        setDraftTitle(issue.title ?? "");
        setDraftDescription(issue.description ?? "");
        setDraftAssigneeId(issue.assigneeProfileId ?? "");
        setEditOpen(true);
    };

    const submitEdit = async () => {
        if (!editingIssue || !perms.edit) return;
        await repo.update({
            id: editingIssue.id,
            title: draftTitle,
            description: draftDescription,
            assigneeProfileId: draftAssigneeId || null,
        });
        setEditOpen(false);
    };

    const openDelete = (issue: any) => {
        if (!perms.delete) return;
        setEditingIssue(issue);
        setDeleteOpen(true);
    };

    const submitDelete = async () => {
        if (!editingIssue || !perms.delete) return;
        await repo.delete(editingIssue.id);
        setDeleteOpen(false);
    };

    const assignSprint = async (issue: any, sprintId: string | "") => {
        if (!perms.edit) return;
        await repo.update({
            id: issue.id,
            sprintId: sprintId || null,
        });
    };

    const assignProfile = async (issue: any, profileId: string | "") => {
        if (!perms.edit) return;
        await repo.update({
            id: issue.id,
            assigneeProfileId: profileId || null,
        });
    };

    return (
        <Section title="Backlog">
            {perms.create && (
                <Button variant="primary" onClick={openCreate}>
                    + New Issue
                </Button>
            )}

            <List>
                {issues.map((i) => (
                    <ListItem key={i.id}>
                        <div className="issue-row">
                            <div className="issue-main">
                                <strong>{i.title}</strong>
                                {i.description && <p>{i.description}</p>}
                                {(i.assigneeProfileId && i.assigneeProfileId !== "") && (
                                    <p>
                                        Assignee:{" "}
                                        {
                                            profiles.find(
                                                (p) => p.id === i.assigneeProfileId
                                            )?.displayName
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="issue-actions">
                                {perms.edit && (
                                    <Button onClick={() => openEdit(i)}>Edit</Button>
                                )}
                                {perms.delete && (
                                    <Button
                                        variant="danger"
                                        onClick={() => openDelete(i)}
                                    >
                                        Delete
                                    </Button>
                                )}

                                <label className="issue-sprint-select">
                                    Sprint:
                                    <select
                                        value={i.sprintId ?? ""}
                                        onChange={(e) =>
                                            assignSprint(i, e.target.value)
                                        }
                                        disabled={!perms.edit}
                                    >
                                        <option value="">Unassigned</option>
                                        {sprints.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="issue-assignee-select">
                                    Assignee:
                                    <select
                                        value={i.assigneeProfileId ?? ""}
                                        onChange={(e) =>
                                            assignProfile(i, e.target.value)
                                        }
                                        disabled={!perms.edit}
                                    >
                                        <option value="">Unassigned</option>
                                        {profiles.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.displayName}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>
                    </ListItem>
                ))}
            </List>

            <FormModal
                open={createOpen}
                title="New Issue"
                onClose={() => setCreateOpen(false)}
                onSubmit={submitCreate}
            >
                <Input
                    placeholder="Issue title"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                />
                <TextArea
                    placeholder="Issue description"
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                />
                <label>
                    Assignee:
                    <select
                        value={draftAssigneeId}
                        onChange={(e) =>
                            setDraftAssigneeId(e.target.value as string | "")
                        }
                    >
                        <option value="">Unassigned</option>
                        {profiles.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.displayName}
                            </option>
                        ))}
                    </select>
                </label>
            </FormModal>

            <FormModal
                open={editOpen}
                title="Edit Issue"
                onClose={() => setEditOpen(false)}
                onSubmit={submitEdit}
            >
                <Input
                    placeholder="Issue title"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                />
                <TextArea
                    placeholder="Issue description"
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                />
                <label>
                    Assignee:
                    <select
                        value={draftAssigneeId}
                        onChange={(e) =>
                            setDraftAssigneeId(e.target.value as string | "")
                        }
                    >
                        <option value="">Unassigned</option>
                        {profiles.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.displayName}
                            </option>
                        ))}
                    </select>
                </label>
            </FormModal>

            <FormModal
                open={deleteOpen}
                title="Delete Issue"
                onClose={() => setDeleteOpen(false)}
                onSubmit={submitDelete}
            >
                <p>Are you sure you want to delete this issue?</p>
                <p>
                    <strong>{editingIssue?.title}</strong>
                </p>
            </FormModal>
        </Section>
    );
}
