import { setupChecklist } from "@/lib/env";

export function SetupBanner({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-stone-800">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">{title}</p>
      <p className="mt-2 text-sm leading-6">
        The UI is built, but this workspace still needs production credentials before publishing,
        metrics, uploads, and auth can work end to end.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {setupChecklist.map((item) => (
          <span
            key={item}
            className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-medium text-amber-900"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
