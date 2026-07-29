import { BarChart3, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    title: "Lightning Fast Creation",
    description:
      "Draft polished proposals in minutes with live preview, line items, and instant PDF export.",
    icon: Zap,
  },
  {
    title: "Real-time Analytics",
    description:
      "Track proposal status from draft to sent and accepted — know where every deal stands.",
    icon: BarChart3,
  },
  {
    title: "Secure & Professional",
    description:
      "Share branded, client-ready proposal pages with secure auth and clean PDF documents.",
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative border-t border-ink-200/70 bg-[#f7fafb] py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-dark">
            Why Proposaly
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            Everything you need to close with confidence
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            Built for modern B2B teams who want proposals that look sharp and
            move deals forward — without the busywork.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-ink-200/80 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_24px_50px_-28px_rgba(14,21,25,0.35)]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-dark transition group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
