// ══════════════════════════════════════════════════════
// COMPONENT: TaskCard
// PURPOSE:   Displays a single task as a styled row with
//            a toggle checkbox and a delete button. Receives
//            all data as props — owns no state itself.
//            Fires events upward via callback props so
//            TaskBoard can update the single source of truth.
// TYPE:      Client Component — onClick handlers needed.
// PROPS:
//   id       (string)   — unique UUID identifying this task
//   title    (string)   — the task text to display
//   done     (boolean)  — true if the task is completed
//   onToggle (function) — callback fired with id when user
//                         clicks the checkbox. Owned by TaskBoard.
//   onDelete (function) — callback fired with id when user
//                         clicks the delete button. Owned by TaskBoard.
// ══════════════════════════════════════════════════════

'use client';

export default function TaskCard({ id, title, done, onToggle, onDelete }) {

  // Derived value: the text style changes based on done.
  // We compute it here rather than storing it in state
  // because it's always derivable from the done prop —
  // there's no additional information to track.
  const titleClass = done
    ? 'flex-1 text-sm line-through text-neutral-600 transition-colors duration-200'
    : 'flex-1 text-sm text-neutral-100 transition-colors duration-200';

  return (
    // The card is a flex row: checkbox | title | delete button.
    // group enables Tailwind's group-hover: utilities, so
    // the delete button can appear only when the card is hovered.
    <div className={`
      group flex items-center gap-3 px-4 py-3 rounded-xl
      border transition-all duration-150
      ${done
        // Done tasks: dimmed border and faded background
        ? 'bg-neutral-900/40 border-neutral-800/60'
        // Active tasks: full border, slightly lighter background
        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
      }
    `}>

      {/* Toggle button styled as a circular checkbox.
          Clicking it fires onToggle with this task's id.
          TaskBoard receives the id and flips done with .map().
          We use a <button> rather than <input type="checkbox">
          for full styling control over the checked appearance. */}
      <button
        onClick={() => onToggle(id)}
        aria-label={done ? 'Mark task incomplete' : 'Mark task complete'}
        className={`
          w-5 h-5 rounded-full border-2 flex-shrink-0
          flex items-center justify-center
          transition-all duration-150
          ${done
            // Checked state: filled violet circle
            ? 'bg-violet-600 border-violet-600'
            // Unchecked state: ghost circle, violet on hover
            : 'border-neutral-600 hover:border-violet-500'
          }
        `}
      >
        {/* Conditional render: only show the checkmark SVG
            when the task is done. Rendering it always but
            hiding it with opacity would still be in the DOM —
            this approach is cleaner. */}
        {done && (
          <svg
            width="10" height="10" viewBox="0 0 10 10"
            fill="none" stroke="white" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="1.5,5 4,7.5 8.5,2.5" />
          </svg>
        )}
      </button>

      {/* Task title — plain text, styled based on done state.
          titleClass is a derived value computed above. */}
      <span className={titleClass}>{title}</span>

      {/* Delete button — hidden until the card is hovered.
          group-hover:opacity-100 is the Tailwind way to show
          a child element only when a parent (group) is hovered.
          This keeps the UI clean without hiding functionality.
          Clicking fires onDelete with this task's id.
          TaskBoard receives it and removes the task with .filter(). */}
      <button
        onClick={() => onDelete(id)}
        aria-label={`Delete task: ${title}`}
        className="
          opacity-0 group-hover:opacity-100
          w-7 h-7 rounded-lg flex items-center justify-center
          text-neutral-600 hover:text-red-400
          hover:bg-neutral-800
          transition-all duration-150
          flex-shrink-0
        "
      >
        {/* × character used instead of an icon library dependency */}
        <svg
          width="12" height="12" viewBox="0 0 12 12"
          fill="none" stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="1" y1="1" x2="11" y2="11" />
          <line x1="11" y1="1" x2="1"  y2="11" />
        </svg>
      </button>
    </div>
  );
}