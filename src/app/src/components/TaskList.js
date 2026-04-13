// ══════════════════════════════════════════════════════
// COMPONENT: TaskList
// PURPOSE:   Receives the already-filtered array of tasks
//            from TaskBoard and renders a TaskCard for each
//            one. Also renders an empty-state message when
//            the visible list is empty. This component holds
//            no state and performs no filtering itself.
// TYPE:      Client Component — passes onClick callbacks to
//            TaskCard, which requires client-side JS.
// PROPS:
//   tasks    (array)    — the filtered subset of tasks to display.
//                         Pre-filtered by TaskBoard so this
//                         component stays simple.
//   filter   (string)  — the active filter key. Used only to
//                         pick the right empty-state message.
//   onToggle (function) — callback passed through to TaskCard;
//                         fires with a task id when toggled.
//   onDelete (function) — callback passed through to TaskCard;
//                         fires with a task id when deleted.
// ══════════════════════════════════════════════════════

'use client';

import TaskCard from './TaskCard';

// Empty-state messages are derived from the active filter.
// Defined outside the component because they never change.
const EMPTY_MESSAGES = {
  all:    'No tasks yet — add one above.',
  active: 'Nothing active. Well done!',
  done:   'No completed tasks yet.',
};

export default function TaskList({ tasks, filter, onToggle, onDelete }) {

  // Conditional render: if the visible list is empty, show a
  // friendly message instead of an empty container.
  // The message varies by filter so it's contextually accurate.
  if (tasks.length === 0) {
    return (
      <p className="text-center text-sm text-neutral-600 py-12">
        {/* Derived value: look up the message by the current filter key.
            Falls back to the 'all' message if filter is unrecognised. */}
        {EMPTY_MESSAGES[filter] ?? EMPTY_MESSAGES.all}
      </p>
    );
  }

  return (
    // flex + flex-col + gap stacks task cards vertically
    // with consistent spacing between them.
    <div className="flex flex-col gap-2">
      {/* .map() returns a new array of TaskCard elements.
          React uses the key prop to track which cards were
          added, removed, or reordered — without it, React
          would re-render every card on every change, and
          animated transitions could flicker incorrectly.
          We use task.id (a UUID) as the key rather than the
          array index, because indexes shift when items are
          deleted — UUIDs are stable identifiers. */}
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          done={task.done}
          // onToggle and onDelete are callback props owned by
          // TaskBoard. TaskList doesn't use them directly —
          // it just passes them down to TaskCard. This is
          // "prop drilling": the data flows through TaskList
          // on its way to where it's actually needed.
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}