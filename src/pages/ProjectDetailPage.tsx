import { useState } from "react";
import { Section } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { TextArea } from "../components/ui/TextArea";
import { FormModal } from "../components/ui/FormModal";
import { useProjectContext } from "../context/ProjectContext";
import { useProject } from "../hooks/useProject";
import { useUserProfileContext } from "../context/UserProfileContext";
import { useUserProfiles } from "../hooks/useUserProfile";
import { permissionsFor } from "../services/permissions/rolePermissions";
import { ProjectRepository } from "../services/repositories/ProjectRepository";
import type { Page } from "../components/AppShell";

type Props = {
    goToPage: (page: Page) => void;
};

export function ProjectDetailPage({ goToPage }: Props) {
    const { selectedProjectId, setSelectedProjectId } = useProjectContext();
    const project = useProject(selectedProjectId);
    const repo = ProjectRepository();

    const { selectedProfileId } = useUserProfileContext();
    const profiles = useUserProfiles();
    const currentProfile = profiles.find((p) => p.id === selectedProfileId);
    const perms = permissionsFor(currentProfile?.role);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [draftName, setDraftName] = useState("");
    const [draftDescription, setDraftDescription] = useState("");

    if (!selectedProjectId) {
        return (
            <Section title="Project">
                <p>No project selected.</p>
            </Section>
        );
    }

    if (!perms.view) {
        return (
            <Section title="Project">
                <p>You do not have permission to view this project.</p>
            </Section>
        );
    }

    if (!project) {
        return (
            <Section title="Project">
                <p>Loading project...</p>
            </Section>
        );
    }

    const openEdit = () => {
        if (!perms.edit) return;
        setDraftName(project.name ?? "");
        setDraftDescription(project.description ?? "");
        setEditOpen(true);
    };

    const submitEdit = async () => {
        if (!perms.edit) return;
        await repo.update({
            id: project.id,
            name: draftName,
            description: draftDescription,
        });
        setEditOpen(false);
    };

    const openDelete = () => {
        if (!perms.delete) return;
        setDeleteOpen(true);
    };

    const submitDelete = async () => {
        if (!perms.delete) return;
        await repo.delete(project.id);
        setSelectedProjectId(null);
        setDeleteOpen(false);
        goToPage("projects");
    };

    return (
        <Section title={project.name ?? ""}>
            <p>{project.description}</p>

            <div className="project-detail-actions">
                {perms.edit && (
                    <Button onClick={openEdit}>Edit Project</Button>
                )}
                {perms.delete && (
                    <Button variant="danger" onClick={openDelete}>
                        Delete Project
                    </Button>
                )}
            </div>

            <h3 className="project-detail-subtitle">Sections</h3>
            <div className="project-detail-nav">
                <Button onClick={() => goToPage("backlog")}>Backlog</Button>
                <Button onClick={() => goToPage("sprint")}>Sprints</Button>
                <Button onClick={() => goToPage("board")}>Scrum Board</Button>
                <Button onClick={() => goToPage("reports")}>Reports</Button>
            </div>

            <div className="project-detail-back">
                <Button onClick={() => goToPage("projects")}>
                    ← Back to Projects
                </Button>
            </div>

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
                    <strong>{project.name}</strong>
                </p>
            </FormModal>
        </Section>
    );
}
