import { ImportCalendarForm } from "@/components/admin/ImportCalendarForm";
import { SetupBanner } from "@/components/admin/SetupBanner";
import { seedCalendarAction } from "@/app/admin/actions";
import { isConfigured } from "@/lib/data/posts";

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ImportPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
          Import Tools
        </p>
        <h2 className="mt-1 font-display text-4xl text-stone-900">Bring in a 30-day calendar</h2>
      </div>

      {!isConfigured() ? <SetupBanner title="Database connection still missing" /> : null}

      {params.seeded || params.imported ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {params.seeded ? "Starter calendar seeded." : "Content calendar imported."}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <form action={seedCalendarAction} className="glass-panel rounded-[2rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
            Starter seed
          </p>
          <h3 className="mt-2 font-display text-3xl text-stone-900">Load the NCS starter plan</h3>
          <p className="mt-3 text-sm leading-7 text-stone-700">
            Seeds the initial Fresno-focused 4-week Instagram calendar plus reusable content
            templates. Everything comes in as draft, owner approval off, price-safe, and
            dry-run ready.
          </p>
          <button
            type="submit"
            className="mt-6 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Seed starter calendar
          </button>
        </form>

        <ImportCalendarForm />
      </div>
    </div>
  );
}
