# Project Management Core

Project Management Core is a project management full-stack application built with React, TypeScript, and AWS Amplify. It provides authenticated, per‑user‑isolated storage for Projects, Sprints, Issues, and User Profiles, all persisted in the cloud and updated in real time through Amplify’s observeQuery streams. The frontend uses a state‑driven SPA architecture, relying on lightweight React contexts for navigation, selected project/profile state, and toast notifications. A custom UI component system and a cohesive CSS design create a clean, responsive interface suitable for both desktop and mobile use.

The application implements a complete workflow for backlog management, sprint planning, scrum board visualization, reporting dashboards, and role‑based permissions. Each user’s data is protected through Amplify owner‑based authorization, ensuring strict isolation between accounts. CRUD operations are wrapped in repository modules with validation and user‑friendly toast feedback, keeping business logic cleanly separated from UI concerns. Real‑time updates, cloud persistence, and a modular architecture make this project a production‑ready foundation for building collaborative project management tools on AWS.

## License
Project Management Core is licensed under the MIT license. See the LICENSE file for details.
