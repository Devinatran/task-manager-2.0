
import './globals.css';

// metadata is a Next.js App Router convention for setting
// <title> and <meta> tags without writing raw HTML.
export const metadata = {
  title: 'Task Manager',
  description: 'Module 10 project — minimal task manager',
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning prevents a noisy console warning
    // that appears when the server-rendered HTML and the
    // client-hydrated HTML differ slightly (e.g. dark-mode class).
    <html lang="en" suppressHydrationWarning>
      {/* bg-neutral-950 sets a near-black page background.
          min-h-screen ensures the dark bg fills the whole viewport
          even when there are very few tasks. */}
      <body className="bg-neutral-950 text-neutral-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}