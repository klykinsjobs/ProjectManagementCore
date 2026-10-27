import { useAuthenticator } from "@aws-amplify/ui-react";
import { useUserProfileContext } from "../../context/UserProfileContext";
import { useUserProfiles } from "../../hooks/useUserProfile";

export function Header({
    onToggleMenu,
}: {
    onToggleMenu: () => void;
}) {
    const { user, signOut } = useAuthenticator();
    const { selectedProfileId } = useUserProfileContext();
    const profiles = useUserProfiles();

    const activeProfile = profiles.find((p) => p.id === selectedProfileId) ?? null;

    return (
        <div className="header">
            <button
                className="hamburger-button"
                onClick={onToggleMenu}
                aria-label="Toggle navigation"
            >
                <span className="hamburger-bar" />
                <span className="hamburger-bar" />
                <span className="hamburger-bar" />
            </button>

            <div className="header-user">
                <span>{user?.signInDetails?.loginId}</span>

                {activeProfile && (
                    <div className="header-profile-chip">
                        <span
                            className="header-profile-color"
                            style={{ backgroundColor: String(activeProfile.color || "") }}
                        />
                        <span className="header-profile-name">{activeProfile.displayName}</span>
                        <span className="header-profile-role">{activeProfile.role}</span>
                    </div>
                )}

                {!activeProfile && <span>No profile selected</span>}

                <button onClick={signOut}>Sign out</button>
            </div>
        </div>
    );
}
