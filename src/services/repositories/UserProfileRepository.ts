import { client } from "../amplifyClient";
import { validateUserProfile } from "../validation/userProfileValidation";
import { useToast } from "../../context/ToastContext";

export function UserProfileRepository() {
    const toast = useToast();

    return {
        async create(input: { displayName: string; role: string; color: string }) {
            const validation = validateUserProfile(input);
            if (!validation.valid) {
                validation.errors.forEach((e) => toast.error(e));
                return null;
            }

            try {
                const result = await client.models.UserProfile.create({
                    displayName: input.displayName,
                    role: input.role as any,
                    color: input.color,
                });
                toast.success("Profile created");
                return result;
            } catch (err: any) {
                toast.error(err.message || "Failed to create profile");
                return null;
            }
        },

        async update(input: {
            id: string;
            displayName: string;
            role: string;
            color: string;
        }) {
            const validation = validateUserProfile(input);
            if (!validation.valid) {
                validation.errors.forEach((e) => toast.error(e));
                return null;
            }

            try {
                const result = await client.models.UserProfile.update({
                    id: input.id,
                    displayName: input.displayName,
                    role: input.role as any,
                    color: input.color,
                });
                toast.success("Profile updated");
                return result;
            } catch (err: any) {
                toast.error(err.message || "Failed to update profile");
                return null;
            }
        },

        async delete(id: string) {
            try {
                await client.models.UserProfile.delete({ id });
                toast.success("Profile deleted");
                return true;
            } catch (err: any) {
                toast.error(err.message || "Failed to delete profile");
                return false;
            }
        },
    };
}
