import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.36em] text-stone-500">
            NCS Aesthetics Internal App
          </p>
          <h1 className="font-display text-5xl leading-tight text-stone-900 sm:text-6xl">
            Build, approve, schedule, and publish Instagram content without leaving the studio.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-stone-700">
            This workspace is set up for Hydrafacial, facials, waxing, lashes, and brows content.
            It stores post drafts, media assets, approvals, scheduled dates, and dry-run safe
            publishing through the official Instagram Graph API.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Open admin dashboard
            </Link>
            <Link
              href="/admin/import"
              className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
            >
              Seed starter calendar
            </Link>
          </div>
        </section>
        <section className="glass-panel checkerboard rounded-[2rem] p-8">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
              What’s inside
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Instagram-ready post library",
                "Calendar and list planning views",
                "Asset upload with metadata checks",
                "Dry-run safe publishing scheduler",
                "Readable failure logging",
                "Daily published-post metrics collection",
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-white/80 bg-white/85 p-4">
                  <p className="text-sm font-medium text-stone-800">{item}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl bg-[rgba(202,124,92,0.12)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-600">
                Brand context
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-700">
                NCS Aesthetics, 2886 E Shepherd Ave Suite 105, Fresno, CA 93720. Booking is routed
                through GlossGenius and the first live publish stays owner-approved by design.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
