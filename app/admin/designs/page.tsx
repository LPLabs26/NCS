import Link from "next/link";

import { referenceCards, referencePackPublicPath } from "@/lib/content/referencePack";

export default function AdminDesignsPage() {
  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[2rem] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
          Creative Library
        </p>
        <h2 className="mt-1 font-display text-4xl text-stone-900">Reference posts inside the app</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-700">
          These are the first 10 NCS reference designs moved into the scheduler so we can review
          them in one place. Use them as the Canva build direction, then upload the final exported
          assets back onto the matching post in the scheduler.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {referenceCards.map((card, index) => {
          const filename = `${String(index + 1).padStart(2, "0")}-${card.slug}.html`;
          const previewHref = `${referencePackPublicPath}/${filename}`;

          return (
            <article key={card.slug} className="glass-panel rounded-[2rem] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
                    {card.pillar}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-stone-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{card.canvaBuild}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
                    {card.format}
                  </span>
                  {card.logoLockupLabel ? (
                    <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
                      Logo Required
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white">
                <iframe
                  title={card.title}
                  src={previewHref}
                  className="h-[540px] w-full border-0"
                />
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-3 text-sm leading-6 text-stone-700">
                  <div>
                    <p className="font-semibold text-stone-900">Caption preview</p>
                    <p className="mt-1 whitespace-pre-wrap">{card.caption}</p>
                  </div>
                  {card.slidePlan?.length ? (
                    <div>
                      <p className="font-semibold text-stone-900">Slide / overlay plan</p>
                      <ul className="mt-1 space-y-1">
                        {card.slidePlan.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-3 text-sm leading-6 text-stone-700">
                  <div>
                    <p className="font-semibold text-stone-900">Real media priority</p>
                    <p className="mt-1">{card.realMediaPriority}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">AI fallback prompt</p>
                    <p className="mt-1">{card.aiFallbackPrompt}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Compliance</p>
                    <p className="mt-1">{card.compliance}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={previewHref}
                      target="_blank"
                      className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
                    >
                      Open full preview
                    </Link>
                    <Link
                      href="/admin/posts"
                      className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                    >
                      Go to posts
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
