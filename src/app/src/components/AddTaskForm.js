// ══════════════════════════════════════════════════════
// COMPONENT: AddTaskForm
// PURPOSE:   A controlled form that lets the user type a
//            new task title and submit it. This component
//            does NOT own the task list — it only signals
//            upward via the onAdd callback prop.
// TYPE:      Client Component — needs useState to track
//            the input value, and an event handler for submit.
// PROPS:
//   onAdd (function) — callback fired with the trimmed title
//                      string when the user submits a valid task.
//                      Owned by TaskBoard, passed down here.
// ══════════════════════════════════════════════════════

'use client';

import { useState } from 'react';

export default function AddTaskForm({ onAdd }) {

  // WHY title is in local state (not lifted to TaskBoard):
  //   Only this component cares about what the user is currently
  //   typing. Lifting it up to TaskBoard would make TaskBoard
  //   re-render on every keystroke — unnecessary work. Local
  //   state is the right choice when no other component needs it.
  const [title, setTitle] = useState('');

  function handleSubmit(e) {
    // e.preventDefault() stops the browser's default form
    // submission behaviour, which would reload the page and
    // wipe all in-memory React state. We want to handle the
    // submission ourselves, in JavaScript.
    e.preventDefault();

    // Validation: trim() removes leading/trailing whitespace.
    // If the result is an empty string, we return early rather
    // than adding a blank task to the list.
    if (!title.trim()) return;

    // Fire the callback with the cleaned title.
    // TaskBoard receives this and appends the new task to state.
    onAdd(title.trim());

    // Reset the input so the user can immediately type another task.
    setTitle('');
  }

  return (
    // onSubmit on the <form> fires for both Enter key and button click.
    // This is better UX than onClick on the button alone because it
    // also handles keyboard-only users pressing Enter — more accessible.
    <form onSubmit={handleSubmit} className="flex gap-2">

      {/* Controlled input: `value` is always tied to the title state.
          Without this, the input would be "uncontrolled" and React
          wouldn't know what the user typed. `onChange` updates state
          on every keystroke, keeping the input and state in sync. */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        maxLength={200}
        className="
          flex-1 h-10 px-3 rounded-lg text-sm
          bg-neutral-900 border border-neutral-800
          text-neutral-100 placeholder-neutral-600
          outline-none focus:border-violet-500
          focus:ring-2 focus:ring-violet-500/20
          transition-colors
        "
      />

      {/* type="submit" lets this button trigger the form's onSubmit
          handler — no onClick needed. */}
      <button
        type="submit"
        className="
          h-10 px-4 rounded-lg text-sm font-medium
          bg-violet-600 text-white
          hover:bg-violet-500 active:scale-95
          transition-all duration-150
          whitespace-nowrap
        "
      >
        + Add
      </button>
    </form>
  );
}