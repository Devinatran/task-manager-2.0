// ══════════════════════════════════════════════════════
// COMPONENT: TaskStats
// PURPOSE:   Displays live summary counts (total, active,
//            done), a progress bar showing overall completion,
//            and a "Clear done" button. All values arrive as
//            props — this component holds no state of its own.
// TYPE:      Client Component — has an interactive button,
//            but could technically be Server if we moved the
//            button to a separate child. Kept as Client for
//            simplicity at this scale.
// PROPS:
//   total         (number)   — total task count
//   activeCount   (number)   — tasks where done === false
//   completedCount(number)   — tasks where done === true
//   progressPct   (number)   — 0–100, drives progress bar width
//   onClearDone   (function) — callback fired when user clicks
//                              "Clear done"; owned by TaskBoard
// ══════════════════════════════════════════════════════

'use client';

export default function TaskStats({
  total,
  activeCount,
  completedCount,
  progressPct,
  onClearDone,
}) {
  return (
    <div className="flex flex-col gap-3">

      {/* Progress bar — visually shows what percentage of tasks
          are done. The inner div's width is a derived value
          (progressPct) calculated in TaskBoard. We don't store
          it in local state here because it's fully determined
          by the props we already receive. */}
      <div className="h-1 rounded-full bg-neutral-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-violet-500 transition-all duration-300"
          // Inline style used here because Tailwind can't generate
          // dynamic width values like `w-[63%]` at runtime —
          // those need to be known at build time.
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Stat chips row — pill badges showing counts.
          These are purely presentational; they receive numbers
          as props and render them. No logic lives here. */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* Each chip is a simple styled span — no interactivity. */}
        <span className="text-xs px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
          {total} total
        </span>

        {/* Conditional styling: the "active" chip gets a purple
            accent when there are active tasks, to draw the eye
            to what still needs to be done. */}
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

        {/* Spacer pushes the "Clear done" button to the far right.
            flex-1 fills the remaining space between the chips
            and the button, creating a space-between effect. */}
        <span className="flex-1" />

        {/* Conditional render: only show "Clear done" when there
            are actually completed tasks to remove. Showing a
            disabled or useless button would clutter the UI. */}
        {completedCount > 0 && (
          // onClearDone is a callback prop owned by TaskBoard.
          // When clicked, control flows up to TaskBoard which
          // removes all done tasks from state using .filter().
          <button
            onClick={onClearDone}
            className="
              text-xs px-3 py-1 rounded-full
              border border-neutral-700 text-neutral-500
              hover:border-red-500/50 hover:text-red-400
              transition-colors duration-150
            "
          >
            Clear done
          </button>
        )}
      </div>
    </div>
  );
}