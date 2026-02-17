# GitHub Copilot Instructions for PulseCare Pro

This project uses **React (Vite)** with **Tailwind CSS** and **Shadcn/ui** for the frontend, and **Node.js/Express** with **Prisma** for the backend.

## Code Style & Patterns

### 1. General
- Use **ES Module syntax** (`import`/`export`) for frontend.
- Use **CommonJS syntax** (`require`/`module.exports`) for backend.
- Prefer **functional components** with hooks over class components.
- Use **async/await** for asynchronous operations.

### 2. Frontend (React)
- **State Management**: Use `zustand` for client state, `TanStack Query v5` for server state.
- **Styling**: strictly use **Tailwind CSS** classes. Avoid custom CSS files unless necessary (`index.css` for globals).
- **Components**: Use **Shadcn/ui** components from `src/components/ui`.
- **Icons**: Use `lucide-react`.

### 3. Backend (Node.js)
- **Database**: Use `prisma` for all database interactions.
- **Authentication**: JWT in `HttpOnly` cookies.
- **Error Handling**: Pass errors to `next(err)` for the global error handler.

### 4. Testing
- Write descriptive test cases if applicable.
