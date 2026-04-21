"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ImportCalendarForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);
        setError(null);

        const form = event.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
          const response = await fetch("/api/content/import", {
            method: "POST",
            body: formData,
          });
          const payload = (await response.json()) as { error?: string; imported?: number };

          if (!response.ok) {
            setError(payload.error ?? "Import failed.");
            return;
          }

          setMessage(`Imported ${payload.imported ?? 0} posts.`);
          form.reset();
          router.refresh();
        });
      }}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
          Import CSV or JSON
        </p>
        <p className="mt-1 text-sm text-stone-600">
          Upload a content calendar export or paste raw JSON/CSV to bulk create posts.
        </p>
      </div>
      <input
        type="file"
        name="file"
        className="block w-full rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-4 text-sm text-stone-700 file:mr-4 file:rounded-full file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
      />
      <textarea
        name="raw"
        rows={8}
        placeholder='Or paste JSON/CSV here. Example: [{"title":"Hydrafacial Reel", "format":"reel"}]'
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
      />
      <input
        type="text"
        name="filename"
        defaultValue="calendar.json"
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60"
      >
        {isPending ? "Importing..." : "Import calendar"}
      </button>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </form>
  );
}
