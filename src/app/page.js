// ══════════════════════════════════════════════════════
// COMPONENT: Home (page.js)
// PURPOSE:   Self-contained task manager. All components
//            are defined in this single file to avoid any
//            import/module resolution issues.
// TYPE:      Client Component — needs useState and useEffect
// PROPS:     None.
// ══════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';

// ── AddTaskForm ─────────────────────────────────────
// PURPOSE:  Controlled form for adding new tasks.
// PROPS:    onAdd — callback fired with the new task title.
function AddTaskForm({ onAdd }) {
  // Local state: only this component needs the current input value.
  // No need to lift this up since no other component uses it.
  const [title, setTitle] = useState('');

  function handleSubmit(e) {
    // Stops the browser from reloading the page on form submit.
    e.preventDefault();
    // Reject blank or whitespace-only submissions.
    if (!title.trim()) return;
    // Fire the callback upward to TaskBoard which owns the list.
    onAdd(title.trim());
    // Reset the field so the user can type another task immediately.
    setTitle('');
  }

  return (
    // onSubmit handles both Enter key and button click — better
    // accessibility than onClick on the button alone.
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* Controlled input: value mirrors state on every keystroke */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        maxLength={200}
        className="flex-1 h-10 px-3 rounded-lg text-sm bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-600 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors"
      />
      <button
        type="submit"
        className="h-10 px-4 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-500 active:scale-95 transition-all duration-150 whitespace-nowrap"
      >
        + Add
      </button>
    </form>
  );
}

// ── TaskStats ────────────────────────────────────────
// PURPOSE:  Shows live counts and a progress bar.
//           All values are derived props — no state here.
// PROPS:    total, activeCount, completedCount, progressPct,
//           onClearDone
function TaskStats({ total, activeCount, completedCount, progressPct, onClearDone }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Progress bar width is a derived value from TaskBoard.
          Inline style used because Tailwind can't generate
          dynamic widths like w-[63%] at runtime. */}
      <div className="h-1 rounded-full bg-neutral-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-violet-500 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
          {total} total
        </span>

        {/* Conditional styling: violet accent when there are active tasks */}
        <span className={`text-xs px-3 py-1 rounded-full border ${
          activeCount > 0
            ? 'bg-violet-500/10 text-violet-300 border-violet-500/30'
            : 'bg-neutral-800 text-neutral-400 border-neutral-700'
        }`}>
          {activeCount} active
        </span>

        <span className="text-xs px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
          {completedCount} done
        </span>

        <span className="flex-1" />

        {/* Conditional render: only show when there are done tasks to clear */}
        {completedCount > 0 && (
          // onClearDone fires up to TaskBoard which removes all done tasks
          <button
            onClick={onClearDone}
            className="text-xs px-3 py-1 rounded-full border border-neutral-700 text-neutral-500 hover:border-red-500/50 hover:text-red-400 transition-colors duration-150"
          >
            Clear done
          </button>
        )}
      </div>
    </div>
  );
}

// ── FilterBar ────────────────────────────────────────
// PURPOSE:  Three filter buttons. Highlights the active one.
// PROPS:    filter — current filter string
//           onFilterChange — callback fired with new filter
const FILTERS = [
  { key: 'all',    label: 'All'    },
  { key: 'active', label: 'Active' },
  { key: 'done',   label: 'Done'   },
];

function FilterBar({ filter, onFilterChange }) {
  return (
    <div className="inline-flex gap-1">
      {/* .map() returns a new JSX array — key prop lets React
          track which button changed between renders */}
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          // Fires onFilterChange upward to TaskBoard which updates filter state
          onClick={() => onFilterChange(key)}
          className={`h-8 px-4 rounded-lg text-sm transition-all duration-150 ${
            filter === key
              ? 'bg-violet-600 text-white'
              : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── TaskCard ─────────────────────────────────────────
// PURPOSE:  Single task row with toggle checkbox and delete.
// PROPS:    id, title, done, onToggle, onDelete
function TaskCard({ id, title, done, onToggle, onDelete }) {
  // Derived value: text style changes based on done prop.
  // Not stored in state because it's always derivable from props.
  const titleClass = done
    ? 'flex-1 text-sm line-through text-neutral-600 transition-colors duration-200'
    : 'flex-1 text-sm text-neutral-100 transition-colors duration-200';

    return (
      // group enables group-hover: utilities on child elements
      <div className={`group flex items-center gap-3 px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors duration-150`}>
        <input
          type="checkbox"
          checked={done}
          onChange={() => onToggle(id)}
          className="w-4 h-4 rounded border-neutral-700 text-violet-600 focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
        />
        <span className={titleClass}>{title}</span>
        <button
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-all duration-150 text-sm"
        >
          ✕
        </button>
      </div>
    );
  }
  
  // ── TaskBoard ────────────────────────────────────────
  // PURPOSE:  Main state manager. Owns tasks, filter, and
  //           coordinates all child components via callbacks.
  // PROPS:    None.
  function TaskBoard() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
  
    // Derive filtered list based on current filter.
    // Recomputed on every render only if tasks or filter changed.
    const filteredTasks = tasks.filter((task) => {
      if (filter === 'active') return !task.done;
      if (filter === 'done') return task.done;
      return true; // 'all'
    });
  
    // Derive counts for TaskStats.
    const activeCount = tasks.filter((t) => !t.done).length;
    const completedCount = tasks.filter((t) => t.done).length;
    const progressPct = tasks.length > 0
      ? Math.round((completedCount / tasks.length) * 100)
      : 0;
  
    // Add a new task with a unique ID and done=false.
    function handleAddTask(title) {
      const newTask = {
        id: Date.now(),
        title,
        done: false,
      };
      setTasks([...tasks, newTask]);
    }
  
    // Toggle the done flag on a task by ID.
    function handleToggleTask(id) {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, done: !task.done } : task
        )
      );
    }
  
    // Remove a task by ID.
    function handleDeleteTask(id) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  
    // Remove all done tasks at once.
    function handleClearDone() {
      setTasks(tasks.filter((task) => !task.done));
    }
  
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <h1 className="text-4xl font-bold">Task Manager</h1>
  
          <AddTaskForm onAdd={handleAddTask} />
  
          <TaskStats
            total={tasks.length}
            activeCount={activeCount}
            completedCount={completedCount}
            progressPct={progressPct}
            onClearDone={handleClearDone}
          />
  
          <FilterBar filter={filter} onFilterChange={setFilter} />
  
          <div className="flex flex-col gap-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  done={task.done}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              ))
            ) : (
              <p className="text-center text-neutral-500 py-8">
                {filter === 'done'
                  ? 'No completed tasks yet.'
                  : filter === 'active'
                  ? 'No active tasks. Great job!'
                  : 'No tasks yet. Add one to get started!'}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // ── Export ──────────────────────────────────────────
  export default TaskBoard;