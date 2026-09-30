import { useState } from "react";
import { Section } from "../components/ui/Section";
import { List, ListItem } from "../components/ui/List";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { FormModal } from "../components/ui/FormModal";
import { useProjectContext } from "../context/ProjectContext";
import { useSprints } from "../hooks/useSprints";
import { useIssues } from "../hooks/useIssues";
import { useUserProfileContext } from "../context/UserProfileContext";
import { useUserProfiles } from "../hooks/useUserProfile";
import { permissionsFor } from "../services/permissions/rolePermissions";
import { SprintRepository } from "../services/repositories/SprintRepository";

export function SprintPage() {
    const { selectedProjectId } = useProjectContext();
    const { selectedProfileId } = useUserProfileContext();
    const profiles = useUserProfiles();
    const repo = SprintRepository();

    const currentProfile = profiles.find((p) => p.id === selectedProfileId);
    const perms = permissionsFor(currentProfile?.role);

    const sprints = useSprints(
        selectedProjectId ? { projectId: { eq: selectedProjectId } } : undefined
    );

    const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

    const issues = useIssues(
        selectedSprintId ? { sprintId: { eq: selectedSprintId } } : undefined
    );

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [draftName, setDraftName] = useState("");
    const [draftStart, setDraftStart] = useState("");
    const [draftEnd, setDraftEnd] = useState("");

    const [editingSprint, setEditingSprint] = useState<any>(null);

    if (!selectedProfileId) {
        return (
            <Section title="Sprints">
                <p>Please select a profile before accessing sprints.</p>
            </Section>
        );
    }

    if (!perms.view) {
        return (
            <Section title="Sprints">
                <p>You do not have permission to view sprints.</p>
            </Section>
        );
    }

    if (!selectedProjectId) {
        return (
            <Section title="Sprints">
                <p>No project selected.</p>
            </Section>
        );
    }

    const openCreate = () => {
        if (!perms.create) return;

        const now = new Date();
        const end = new Date(now.getTime() + 7 * 86400000);

        setDraftName("");
        setDraftStart(now.toISOString().split("T")[0]);
        setDraftEnd(end.toISOString().split("T")[0]);

        setCreateOpen(true);
    };

    const submitCreate = async () => {
        if (!perms.create) return;
        await repo.create({
            name: draftName,
            startDate: draftStart,
            endDate: draftEnd,
            projectId: selectedProjectId,
        });
        setCreateOpen(false);
    };

    const openEdit = (sprint: any) => {
        if (!perms.edit) return;
        setEditingSprint(sprint);
        setDraftName(sprint.name ?? "");
        setDraftStart(sprint.startDate ?? "");
        setDraftEnd(sprint.endDate ?? "");
        setEditOpen(true);
    };

    const submitEdit = async () => {
        if (!editingSprint || !perms.edit) return;
        await repo.update({
            id: editingSprint.id,
            name: draftName,
            startDate: draftStart,
            endDate: draftEnd,
        });
        setEditOpen(false);
    };

    const openDelete = (sprint: any) => {
        if (!perms.delete) return;
        setEditingSprint(sprint);
        setDeleteOpen(true);
    };

    const submitDelete = async () => {
        if (!editingSprint || !perms.delete) return;
        await repo.delete(editingSprint.id);
        if (selectedSprintId === editingSprint.id) {
            setSelectedSprintId(null);
        }
        setDeleteOpen(false);
    };

    return (
        <Section title="Sprints">
            {perms.create && (
                <Button variant="primary" onClick={openCreate}>
                    + New Sprint
                </Button>
            )}

            <div className="sprint-layout">
                <div className="sprint-list">
                    <h3>All Sprints</h3>
                    <List>
                        {sprints.map((s) => (
                            <ListItem key={s.id}>
                                <div
                                    className={`sprint-item ${selectedSprintId === s.id ? "active" : ""
                                        }`}
                                    onClick={() => setSelectedSprintId(s.id)}
                                >
                                    {s.name} ({s.startDate} → {s.endDate})
                                </div>

                                <div className="sprint-actions">
                                    {perms.edit && (
                                        <Button onClick={() => openEdit(s)}>
                                            Edit
                                        </Button>
                                    )}
                                    {perms.delete && (
                                        <Button
                                            variant="danger"
                                            onClick={() => openDelete(s)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </div>

                <div className="sprint-issues">
                    <h3>Issues in Selected Sprint</h3>
                    {!selectedSprintId && <p>No sprint selected.</p>}
                    {selectedSprintId && (
                        <List>
                            {issues.map((i) => (
                                <ListItem key={i.id}>
                                    {i.title} — {i.status}
                                </ListItem>
                            ))}
                        </List>
                    )}
                </div>
            </div>

            <FormModal
                open={createOpen}
                title="New Sprint"
                onClose={() => setCreateOpen(false)}
                onSubmit={submitCreate}
            >
                <Input
                    placeholder="Sprint name"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                />
                <Input
                    placeholder="Start date (YYYY-MM-DD)"
                    value={draftStart}
                    onChange={(e) => setDraftStart(e.target.value)}
                />
                <Input
                    placeholder="End date (YYYY-MM-DD)"
                    value={draftEnd}
                    onChange={(e) => setDraftEnd(e.target.value)}
                />
            </FormModal>

            <FormModal
                open={editOpen}
                title="Edit Sprint"
                onClose={() => setEditOpen(false)}
                onSubmit={submitEdit}
            >
                <Input
                    placeholder="Sprint name"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                />
                <Input
                    placeholder="Start date (YYYY-MM-DD)"
                    value={draftStart}
                    onChange={(e) => setDraftStart(e.target.value)}
                />
                <Input
                    placeholder="End date (YYYY-MM-DD)"
                    value={draftEnd}
                    onChange={(e) => setDraftEnd(e.target.value)}
                />
            </FormModal>

            <FormModal
                open={deleteOpen}
                title="Delete Sprint"
                onClose={() => setDeleteOpen(false)}
                onSubmit={submitDelete}
            >
                <p>Are you sure you want to delete this sprint?</p>
                <p>
                    <strong>{editingSprint?.name}</strong>
                </p>
            </FormModal>
        </Section>
    );
}
