import { useState } from "react";
import { Section } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { FormModal } from "../components/ui/FormModal";
import { useUserProfiles } from "../hooks/useUserProfile";
import { UserProfileRepository } from "../services/repositories/UserProfileRepository";
import { useUserProfileContext } from "../context/UserProfileContext";
import { permissionsFor } from "../services/permissions/rolePermissions";

export function ProfilePage() {
    const profiles = useUserProfiles();
    const repo = UserProfileRepository();
    const { selectedProfileId, setSelectedProfileId } = useUserProfileContext();

    const currentProfile = profiles.find((p) => p.id === selectedProfileId);
    const perms = permissionsFor(currentProfile?.role);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

    const [draftName, setDraftName] = useState("");
    const [draftRole, setDraftRole] = useState("MEMBER");
    const [draftColor, setDraftColor] = useState("#4f46e5");

    const openCreate = () => {
        setEditingProfileId(null);
        setDraftName("");
        setDraftRole("MEMBER");
        setDraftColor("#4f46e5");
        setEditOpen(true);
    };

    const openEdit = (id: string) => {
        if (!perms.edit) return;
        const profile = profiles.find((p) => p.id === id);
        if (!profile) return;

        setEditingProfileId(id);
        setDraftName(profile.displayName ?? "");
        setDraftRole(profile.role ?? "MEMBER");
        setDraftColor(profile.color ?? "#4f46e5");
        setEditOpen(true);
    };

    const openDelete = (id: string) => {
        if (!perms.delete) return;
        setEditingProfileId(id);
        setDeleteOpen(true);
    };

    const submitEdit = async () => {
        if (editingProfileId) {
            if (!perms.edit) return;
            await repo.update({
                id: editingProfileId,
                displayName: draftName,
                role: draftRole,
                color: draftColor,
            });
        } else {
            const created = await repo.create({
                displayName: draftName,
                role: draftRole,
                color: draftColor,
            });
            if (created?.data?.id) {
                setSelectedProfileId(created.data.id);
            }
        }
        setEditOpen(false);
    };

    const submitDelete = async () => {
        if (!editingProfileId || !perms.delete) return;
        await repo.delete(editingProfileId);

        if (selectedProfileId === editingProfileId) {
            setSelectedProfileId(null);
        }

        setDeleteOpen(false);
    };

    const handleSelectProfile = (id: string) => {
        setSelectedProfileId(id);
    };

    const handleDeselect = () => {
        setSelectedProfileId(null);
    };

    return (
        <Section title="Profiles">
            <div className="profile-header">
                <Button variant="primary" onClick={openCreate}>
                    + New Profile
                </Button>

                {selectedProfileId && (
                    <Button onClick={handleDeselect}>
                        Deselect
                    </Button>
                )}
            </div>

            <div className="profile-list">
                {profiles.length === 0 && (
                    <p>No profiles yet. Create one to continue.</p>
                )}

                {profiles.map((p) => (
                    <div
                        key={p.id}
                        className={`profile-item ${selectedProfileId === p.id ? "active" : ""
                            }`}
                    >
                        <div className="profile-main">
                            <span
                                className="profile-color-chip"
                                style={{ backgroundColor: String(p.color || "") }}
                            />
                            <span className="profile-name">{p.displayName}</span>
                            <span className="profile-role">({p.role})</span>
                        </div>

                        <div className="profile-actions">
                            <Button onClick={() => handleSelectProfile(p.id)}>
                                {selectedProfileId === p.id ? "Selected" : "Select"}
                            </Button>

                            {perms.edit && (
                                <Button onClick={() => openEdit(p.id)}>Edit</Button>
                            )}

                            {perms.delete && (
                                <Button
                                    variant="danger"
                                    onClick={() => openDelete(p.id)}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <FormModal
                open={editOpen}
                title={editingProfileId ? "Edit Profile" : "New Profile"}
                onClose={() => setEditOpen(false)}
                onSubmit={submitEdit}
            >
                <Input
                    placeholder="Display name"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                />
                <label>
                    Role:
                    <select
                        value={draftRole}
                        onChange={(e) => setDraftRole(e.target.value)}
                    >
                        <option value="ADMIN">Admin</option>
                        <option value="MEMBER">Member</option>
                        <option value="VIEWER">Viewer</option>
                    </select>
                </label>
                <label>
                    Color:
                    <Input
                        type="color"
                        value={draftColor}
                        onChange={(e) => setDraftColor(e.target.value)}
                    />
                </label>
            </FormModal>

            <FormModal
                open={deleteOpen}
                title="Delete Profile"
                onClose={() => setDeleteOpen(false)}
                onSubmit={submitDelete}
            >
                <p>Are you sure you want to delete this profile?</p>
                <p>
                    <strong>
                        {profiles.find((p) => p.id === editingProfileId)?.displayName}
                    </strong>
                </p>
            </FormModal>
        </Section>
    );
}
