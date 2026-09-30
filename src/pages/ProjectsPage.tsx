import { useState } from "react";
import { Section } from "../components/ui/Section";
import { List, ListItem } from "../components/ui/List";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { TextArea } from "../components/ui/TextArea";
import { FormModal } from "../components/ui/FormModal";
import { useProjects } from "../hooks/useProjects";
import { useProjectContext } from "../context/ProjectContext";
import { useUserProfileContext } from "../context/UserProfileContext";
import { useUserProfiles } from "../hooks/useUserProfile";
import { permissionsFor } from "../services/permissions/rolePermissions";
import { ProjectRepository } from "../services/repositories/ProjectRepository";
import type { Page } from "../components/AppShell";

type Props = {
    goToPage: (page: Page) => void;
};

export function ProjectsPage({ goToPage }: Props) {
    const projects = useProjects();
    const { selectedProjectId, setSelectedProjectId } = useProjectContext();
    const { selectedProfileId } = useUserProfileContext();
    const profiles = useUserProfiles();
    const repo = ProjectRepository();

    const currentProfile = profiles.find((p) => p.id === selectedProfileId);
    const perms = permissionsFor(currentProfile?.role);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [draftName, setDraftName] = useState("");
    const [draftDescription, setDraftDescription] = useState("");
    const [editingProject, setEditingProject] = useState<any>(null);

    const openCreate = () => {
        if (!perms.create) return;
        setDraftName("");
        setDraftDescription("");
        setCreateOpen(true);
    };

    const submitCreate = async () => {
        if (!perms.create) return;
        await repo.create({
            name: draftName,
            description: draftDescription,
        });
        setCreateOpen(false);
    };

    const openEdit = (project: any) => {
        if (!perms.edit) return;
        setEditingProject(project);
        setDraftName(project.name ?? "");
        setDraftDescription(project.description ?? "");
        setEditOpen(true);
    };

    const submitEdit = async () => {
        if (!perms.edit || !editingProject) return;
        await repo.update({
            id: editingProject.id,
            name: draftName,
            description: draftDescription,
        });
        setEditOpen(false);
    };

    const openDelete = (project: any) => {
        if (!perms.delete) return;
        setEditingProject(project);
        setDeleteOpen(true);
    };

    const submitDelete = async () => {
        if (!perms.delete || !editingProject) return;
        await repo.delete(editingProject.id);
        if (selectedProjectId === editingProject.id) {
            setSelectedProjectId(null);
        }
        setDeleteOpen(false);
    };

    const handleSelect = (id: string) => {
        setSelectedProjectId(id);
        goToPage("projectDetail");
    };

    const handleDeselect = () => {
        setSelectedProjectId(null);
    };

    return (
        <Section title="Projects">
            {perms.create && (
                <Button variant="primary" onClick={openCreate}>
                    + New Project
                </Button>
            )}

            {selectedProjectId && (
                <Button onClick={handleDeselect}>
                    Deselect
                </Button>
            )}

            <List>
                {projects.map((p) => (
                    <ListItem key={p.id}>
                        <div
                            className={`project-item ${selectedProjectId === p.id ? "active" : ""
                                }`}
                        >
                            <div className="project-row">
                                <span className="project-name">{p.name}</span>

                                <div className="project-actions">
                                    <Button onClick={() => handleSelect(p.id)}>
                                        {selectedProjectId === p.id
                                            ? "Selected"
                                            : "Select"}
                                    </Button>

                                    {perms.edit && (
                                        <Button onClick={() => openEdit(p)}>
                                            Edit
                                        </Button>
                                    )}

                                    {perms.delete && (
                                        <Button
                                            variant="danger"
                                            onClick={() => openDelete(p)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ListItem>
                ))}
            </List>

            <FormModal
                open={createOpen}
                title="New Project"
                onClose={() => setCreateOpen(false)}
                onSubmit={submitCreate}
            >
                <Input
                    placeholder="Project name"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                />
                <TextArea
                    placeholder="Project description"
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                />
            </FormModal>

            <FormModal
                open={editOpen}
                title="Edit Project"
                onClose={() => setEditOpen(false)}
                onSubmit={submitEdit}
            >
                <Input
                    placeholder="Project name"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                />
                <TextArea
                    placeholder="Project description"
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                />
            </FormModal>

            <FormModal
                open={deleteOpen}
                title="Delete Project"
                onClose={() => setDeleteOpen(false)}
                onSubmit={submitDelete}
            >
                <p>Are you sure you want to delete this project?</p>
                <p>
                    <strong>{editingProject?.name}</strong>
                </p>
            </FormModal>
        </Section>
    );
}
