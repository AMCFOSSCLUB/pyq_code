# AMCFOSS PYQ

A comprehensive Next.js 14 application serving as a platform for Previous Year Questions (PYQs). The project is built with a strictly separated frontend and backend architecture to ensure clean code and easy scalability.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Frontend:** React 18, Tailwind CSS, Lucide React
- **Authentication:** NextAuth.js
- **Database:** Firebase (Firestore)
- **Storage/Version Control Integration:** Octokit (GitHub API)

## Architecture overview

The application is structured to distinctly separate UI concerns from server-side business logic within the `src/` directory.

### Directory Structure

```text
src/
├── app/                  # Next.js App Router (Pages & API Routes)
├── frontend/             # All Client-Side Code
│   ├── components/       # Reusable React components (UI, Forms, Modals)
│   └── utils/            # Client-side utilities (e.g., Firebase Client setup)
└── backend/              # All Server-Side Code
    ├── config/           # Server configuration (e.g., Firebase Admin setup)
    └── services/         # Core business logic (Auth, GitHub API integrations)
```

- **Frontend:** The `src/frontend` folder holds components that build the user interface. These are imported by the Next.js pages in `src/app`.
- **Backend:** The `src/backend` folder holds the core database interaction and server actions. These are imported and executed by Next.js API Routes in `src/app/api`.

## Getting Started

First, install the necessary dependencies:

```bash
npm install
```

Ensure you have a `.env.local` file configured with the required environment variables (refer to `.env.local.example` if available, or set up Firebase, GitHub, and NextAuth credentials).

### Available Scripts

In the project directory, you can run:

#### `npm run dev`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

#### `npm run build`

Builds the app for production to the `.next` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

#### `npm start`

Starts the production server after a build has been completed.

#### `npm run lint`

Runs the Next.js ESLint configuration to find and fix styling or type issues.
