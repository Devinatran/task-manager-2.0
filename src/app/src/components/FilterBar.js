// ══════════════════════════════════════════════════════
// COMPONENT: FilterBar
// PURPOSE:   Renders the three filter buttons (All, Active,
//            Done). Highlights whichever filter is currently
//            active. Does not own the filter value — it reads
//            it from props and fires a callback to change it.
// TYPE:      Client Component — button click handlers needed.
// PROPS:
//   filter         (string)   — current filter: 'all' | 'active' | 'done'
//                               Owned by TaskBoard, read here for styling.
//   onFilterChange (function) — callback fired with the new filter
//                               string when a button is clicked.
//                               TaskBoard updates its filter state.
// ══════════════════════════════════════════════════════

'use client';

// FILTERS is defined outside the component so it's created once,
// not re-created on every render. It's a constant — not state —
// because the list of filter options never changes.
const FILTERS = [
  { key: 'all',    label: 'All'    },
  { key: 'active', label: 'Active' },
  { key: 'done',   label: 'Done'   },
];

export default function FilterBar({ filter, onFilterChange }) {
  return (
    // inline-flex + gap keeps the buttons packed together
    // without stretching them to fill the row.
    <div className="inline-flex gap-1">
      {/* We derive the button list from the FILTERS array using
          .map(), which returns a new array of JSX elements.
          React needs a unique `key` on each element in a mapped
          list so it can track which items changed during re-render. */}
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          // When clicked, this fires onFilterChange with the button's
          // key string (e.g. 'active'). TaskBoard receives it and
          // updates the filter state, which flows back down here
          // as the updated `filter` prop — closing the data loop.
          onClick={() => onFilterChange(key)}
          className={`
            h-8 px-4 rounded-lg text-sm transition-all duration-150
            ${filter === key
              // Active filter: filled violet background
              ? 'bg-violet-600 text-white'
              // Inactive filter: ghost style, lights up on hover
              : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}