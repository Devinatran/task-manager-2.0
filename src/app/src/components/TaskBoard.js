// ══════════════════════════════════════════════════════
// COMPONENT: TaskBoard
// PURPOSE:   The central "brain" of the app. Owns all task
//            state and the active filter. Passes data DOWN
//            to children as props, and receives events UP
//            from children via callback props. This pattern
//            is called "lifting state up" — the single source
//            of truth lives here so every child always sees
//            consistent data.
// TYPE:      Client Component — needs useState and useEffect,
//            which are only available in the browser.
// PROPS:     None — this is the top of the data tree.
// ══════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import AddTaskForm from './AddTaskForm';
import FilterBar   from './FilterBar';
import TaskStats   from './TaskStats';
import TaskList    from './TaskList';

export default function TaskBoard() {

  // ── STATE ───────────────────────────────────────────────
  //
  // WHY tasks is in state:
  //   The task list changes over time (add, toggle, delete).
  //   React needs to know about those changes so it can
  //   re-render the UI. State is the right tool for any value
  //   that, when changed, should cause a re-render.
  //
  // Lazy initializer (the function passed to useState):
  //   Instead of always starting with [], we read localStorage
  //   on the very first render so saved tasks are restored.
  //   We pass a FUNCTION, not a value, so this expensive read
  //   only runs once — not on every subsequent render.
  //
  // typeof window guard:
  //   Next.js runs this component on the Node.js server before
  //   sending HTML to the browser (Server-Side Rendering).
  //   The server has no browser APIs, so `window` doesn't exist
  //   there. Without this guard, accessing localStorage on the
  //   server would throw a ReferenceError and crash the build.
  //   Returning [] on the server is safe — useEffect will load
  //   the real data on the client after hydration.
  const [tasks, setTasks] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('tm-tasks-v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      // JSON.parse can throw if localStorage contains corrupted
      // data. We fall back to an empty list rather than crashing.
      return [];
    }
  });

  // WHY filter is separate state and not derived from tasks:
  //   The active filter (all / active / done) changes independently
  //   from the task list — the user can switch filters without
  //   adding or removing any tasks. Two separate useState calls
  //   keeps each piece of state focused on one responsibility.
  const [filter, setFilter] = useState('all');

  // ── EFFECT: Persist tasks to localStorage ───────────────
  //
  // useEffect syncs React state with an external system —
  // in this case, the browser's localStorage API.
  //
  // Dependency array [tasks]:
  //   React runs this effect after every render where `tasks`
  //   changed. Omitting the array would run it after EVERY
  //   render (wasteful). An empty array [] would run it only
  //   once on mount (so new tasks would never be saved).
  //   [tasks] is exactly right: re-sync whenever tasks change.
  useEffect(() => {
    try {
      localStorage.setItem('tm-tasks-v1', JSON.stringify(tasks));
    } catch {
      // localStorage can throw in private browsing or when full.
      // We swallow the error silently — losing persistence is
      // acceptable; crashing the app is not.
    }
  }, [tasks]);

  // ── DERIVED VALUES ──────────────────────────────────────
  //
  // These values are computed fresh on every render from tasks.
  // They are NOT stored in state because they can always be
  // calculated from tasks — storing them would create a second
  // source of truth that could get out of sync (a common bug).
  //
  // completedCount: the number of done tasks, used by TaskStats.
  const completedCount = tasks.filter((t) => t.done).length;

  // activeCount: the number of incomplete tasks.
  const activeCount = tasks.length - completedCount;

  // progressPct: 0–100, drives the progress bar in TaskStats.
  // We guard against dividing by zero when the list is empty.
  const progressPct = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  // visibleTasks: the subset of tasks the current filter shows.
  // Derived here (not in TaskList) so TaskStats always sees the
  // full counts regardless of which filter is active.
  const visibleTasks =
    filter === 'done'   ? tasks.filter((t) => t.done)  :
    filter === 'active' ? tasks.filter((t) => !t.done) :
    tasks; // 'all' — show everything

  // ── HANDLERS ────────────────────────────────────────────
  //
  // Each handler is defined here and passed DOWN to a child
  // as a callback prop. The child component doesn't own the
  // state, so it can't update it directly — it fires the
  // callback and lets TaskBoard do the update.
  //
  // Immutable update pattern:
  //   React detects state changes by comparing references.
  //   If we mutated the existing array (e.g. tasks.push(…)),
  //   the reference stays the same and React would not
  //   re-render. .map(), .filter(), and spread [...] always
  //   return a NEW array, so React sees the change correctly.

  // handleAdd: creates a new task object and appends it.
  // crypto.randomUUID() generates a guaranteed-unique id so
  // React can use it as a stable key for list reconciliation.
  function handleAdd(title) {
    setTasks([...tasks, { id: crypto.randomUUID(), title, done: false }]);
  }

  // handleToggle: flips the done flag on one task.
  // .map() returns a new array. The spread { ...t } copies
  // all existing task fields, then done: !t.done overwrites
  // just the done property — all other fields are preserved.
  function handleToggle(id) {
    setTasks(tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  }

  // handleDelete: removes the task whose id matches.
  // .filter() returns a new array containing every task
  // except the deleted one.
  function handleDelete(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  // handleClearDone: removes every completed task at once.
  function handleClearDone() {
    setTasks(tasks.filter((t) => !t.done));
  }

  // ── RENDER ───────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">

      {/* Page heading — static, no interactivity needed */}
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-neutral-100">
          My tasks
        </h1>
        {/* Conditional render: only show the date string once
            the component has mounted on the client. The server
            doesn't know the user's local time, so rendering this
            on the server would cause a hydration mismatch. */}
        <p className="text-sm text-neutral-500 mt-1">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      {/* AddTaskForm is a controlled child component.
          onAdd is the callback it fires when the user submits.
          TaskBoard owns the task list, so data flows up here
          to be added to state. */}
      <AddTaskForm onAdd={handleAdd} />

      {/* TaskStats receives derived values (not raw state) so
          it never has to compute them itself. onClearDone is
          a callback that fires handleClearDone in TaskBoard. */}
      <TaskStats
        total={tasks.length}
        activeCount={activeCount}
        completedCount={completedCount}
        progressPct={progressPct}
        onClearDone={handleClearDone}
      />

      {/* FilterBar needs the current filter so it can highlight
          the active button, and onFilterChange so it can tell
          TaskBoard which filter the user picked. */}
      <FilterBar filter={filter} onFilterChange={setFilter} />

      {/* TaskList receives the already-filtered task array so it
          doesn't need to know about the filter logic itself.
          The toggle and delete callbacks flow down to TaskCard
          via TaskList (prop drilling — acceptable at this scale). */}
      <TaskList
        tasks={visibleTasks}
        filter={filter}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  );
}