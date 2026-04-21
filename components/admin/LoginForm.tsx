"use client";

import { useState, useTransition } from "react";

import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);
        setError(null);

        startTransition(async () => {
          try {
            const supabase = createSupabaseBrowser();
            const { error: authError } = await supabase.auth.signInWithOtp({
              email,
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
              },
            });

            if (authError) {
              throw authError;
            }

            setMessage("Magic link sent. Check the inbox for the account you use to manage the studio.");
          } catch (submitError) {
            setError(
              submitError instanceof Error ? submitError.message : "Unable to start sign-in.",
            );
          }
        });
      }}
    >
      <label className="block text-sm font-medium text-stone-700" htmlFor="email">
        Admin email
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none ring-0 placeholder:text-stone-400 focus:border-stone-500"
        placeholder="natalie@example.com"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send magic link"}
      </button>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </form>
  );
}
