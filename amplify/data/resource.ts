import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
    UserProfile: a
        .model({
            displayName: a.string().validate(v =>
                v
                    .minLength(1, "Display name must be at least 1 character long")
                    .maxLength(100, "Display name must be less than 100 characters")
            ),
            role: a.enum(["ADMIN", "MEMBER", "VIEWER"]),
            color: a.string().validate(v =>
                v
                    .minLength(1, "Color must be at least 1 character long")
                    .maxLength(20, "Color must be less than 20 characters")
            ),
        })
        .authorization(allow => [allow.owner()]),

    Project: a
        .model({
            name: a.string().validate(v =>
                v
                    .minLength(1, "Name must be at least 1 character long")
                    .maxLength(100, "Name must be less than 100 characters")
            ),
            description: a.string().validate(v =>
                v
                    .maxLength(1000, "Description must be less than 1000 characters")
            ),
        })
        .authorization(allow => [allow.owner()]),

    Sprint: a
        .model({
            name: a.string().validate(v =>
                v
                    .minLength(1, "Name must be at least 1 character long")
                    .maxLength(100, "Name must be less than 100 characters")
            ),
            startDate: a.date(),
            endDate: a.date(),
            projectId: a.id().required(),
        })
        .authorization(allow => [allow.owner()]),

    Issue: a
        .model({
            title: a.string().validate(v =>
                v
                    .minLength(1, "Title must be at least 1 character long")
                    .maxLength(100, "Title must be less than 100 characters")
            ),
            description: a.string().validate(v =>
                v
                    .maxLength(1000, "Description must be less than 1000 characters")
            ),
            status: a.enum(["TODO", "IN_PROGRESS", "DONE"]),
            projectId: a.id().required(),
            sprintId: a.id(),
            assigneeProfileId: a.id(),
        })
        .authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool",
    },
});
