# Task Manager — Module 10 Project

A minimal, dark-accented task manager built with Next.js 16, React 19, and Tailwind CSS v4.

## Design Direction

**Minimal/Professional** — purple accent on a clean neutral surface, pill-style stat chips,
a live progress bar, hover-only delete buttons, and a compact layout that feels like a real
productivity tool rather than a tutorial demo.

## Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd task-manager

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    page.js          # Server Component — renders TaskBoard
    layout.js        # Root layout (Tailwind font wiring)
    globals.css      # Tailwind base import only
  components/
    TaskBoard.js     # Client Component — owns all state
    AddTaskForm.js   # Controlled input form
    FilterBar.js     # All / Active / Done filter buttons
    TaskStats.js     # Stat chips + clear-completed button
    TaskList.js      # Renders the filtered task array
    TaskCard.js      # Single task row (toggle + delete)
```

## AI Usage Log

- **Scaffolding comments**: Asked Claude to suggest the correct JSDoc wording for the
  `typeof window` SSR guard. It explained that Next.js runs components on the Node.js server
  before hydration, where `window` is undefined, so the guard prevents a ReferenceError.
  I rewrote the comment in my own words.

- **Tailwind palette**: Asked Claude for five minimal dark-accent colour palette options.
  Chose the purple/neutral combo and adjusted the shade to `violet-500` after testing in
  the browser.

- **useEffect dependency array**: Asked why omitting `tasks` from the dependency array would
  cause a stale-closure bug. Claude's explanation helped me write the comment in TaskBoard.js
  explaining the dependency array's purpose.