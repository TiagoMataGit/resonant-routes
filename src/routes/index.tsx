import { createFileRoute } from "@tanstack/react-router";
import {
  AudioLines,
  BadgeCheck,
  Car,
  Download,
  Headphones,
  ListMusic,
  Plane,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import heroImage from "@/assets/hero-listener.jpg";
import { BookingSection } from "@/components/BookingSection";
import { ChatWidget } from "@/components/ChatWidget";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Premium Sound, Zero Interruptions | Listening Without Ads" },
      {
        name: "description",
        content:
          "Ad-free, lossless music you can download and play in any order. Try 3 months free, cancel anytime.",
      },
      { property: "og:title", content: "Premium Sound, Zero Interruptions" },
      {
        property: "og:description",
        content:
          "Ad-free, lossless music you can download and play in any order. Try 3 months free, cancel anytime.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const personas = [
  {
    icon: Headphones,
    role: "The Deep Listener",
    frustration: "Ads cut the song right at the drop, and compressed audio flattens everything.",
    outcome: "Lossless, uninterrupted sound from first note to last.",
  },
  {
    icon: Plane,
    role: "The Commuter",
    frustration: "Tunnels, planes and dead zones kill the playlist halfway through.",
    outcome: "Thousands of tracks downloaded and ready, signal or not.",
  },
  {
    icon: Users,
    role: "The Household Organiser",
    frustration: "Paying for four separate accounts and refereeing who controls the speaker.",
    outcome: "One plan, up to six profiles, everyone keeps their own taste.",
  },
];

const features = [
  {
    icon: Zap,
    name: "Ad-free listening",
    benefit: "Every session runs start to finish with nothing breaking the mood.",
  },
  {
    icon: AudioLines,
    name: "Lossless audio",
    benefit: "Hear the detail the studio recorded, up to 24-bit/44.1 kHz.",
  },
  {
    icon: Download,
    name: "Offline downloads",
    benefit: "Your library travels with you, even with no signal at all.",
  },
  {
    icon: ListMusic,
    name: "Full playback control",
    benefit: "Any song, any order, unlimited skips and repeats.",
  },
  {
    icon: Radio,
    name: "Taste that learns you",
    benefit: "Fresh mixes and daily lists that match your mood without the search.",
  },
  {
    icon: Car,
    name: "Every device you own",
    benefit: "Move from car to kitchen to headphones without missing a beat.",
  },
];

const faqs = [
  {
    q: "How much does it cost after the free trial?",
    a: "The Individual plan is $12.99 per month after your three free months. Duo is $18.99, Family is $21.99, and students pay $6.99.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. Cancel online in a couple of clicks and you keep Premium until the end of the period you already paid for.",
  },
  {
    q: "Will I be charged during the free trial?",
    a: "No. Nothing is charged until the trial ends, and we email you before the first payment so there are no surprises.",
  },
  {
    q: "Who is eligible for the free trial?",
    a: "The three-month offer is for people who have not tried Premium before. If you have, you can still start a paid plan any time.",
  },
  {
    q: "What is the difference between the free and Premium versions?",
    a: "Free includes ads, shuffled playback and no downloads. Premium removes the ads and unlocks lossless audio, offline listening and full control over what plays next.",
  },
  {
    q: "Does lossless audio use more data?",
    a: "It does, so you can set a lower quality for mobile data and keep lossless for Wi-Fi and downloads.",
  },
  {
    q: "How many songs can I download?",
    a: "Thousands, across up to five devices, so a full library fits in your pocket for flights and commutes.",
  },
  {
    q: "Can I share my plan with family?",
    a: "The Family plan covers up to six people at the same address, each with their own profile, recommendations and parental controls.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "You add a payment method so your listening continues automatically when the trial ends, but you can remove it by cancelling before then.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes, you can move between Individual, Duo, Family and Student whenever your situation changes. The new price applies from your next billing date.",
  },
  {
    q: "Does Premium work outside my country?",
    a: "Yes, travel with it. Your account stays active abroad and your downloads work anywhere.",
  },
  {
    q: "What happens to my playlists if I go back to free?",
    a: "Nothing is lost. Your playlists, saved albums and history stay exactly where they are.",
  },
];

function Landing() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <AudioLines className="size-5 text-primary" aria-hidden />
            Resonance
          </span>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#who">
              Who it's for
            </a>
            <a className="transition-colors hover:text-foreground" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-foreground" href="#faq">
              FAQ
            </a>
            <a className="transition-colors hover:text-foreground" href="#agendar">
              Agendar reunião
            </a>
          </div>
          <a
            href="#start"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Start free
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" aria-hidden /> 3 months free — offer ends
              soon
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Your music, <span className="text-gradient">never interrupted</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Ad-free, lossless sound you can download and play in any order — on every device you
              already own.
            </p>
            <div id="start" className="mt-8 flex flex-wrap gap-3">
              <a
                href="#features"
                className="glow rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-transform hover:scale-105"
              >
                Try 3 months for $0
              </a>
              <a
                href="#who"
                className="rounded-full border border-border px-7 py-3.5 font-semibold transition-colors hover:bg-secondary"
              >
                See how it works
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Then $12.99/month. Cancel anytime. No card charged during the trial.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <img
              src={heroImage}
              width={1280}
              height={1280}
              alt="Listener immersed in music wearing headphones under green neon light"
              className="glow w-full rounded-3xl border border-border object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Audience */}
      <section id="who" className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Who it's for</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Built for people whose day has a soundtrack, and who are tired of it being cut short.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {personas.map((p, i) => (
            <Reveal key={p.role} delay={i * 100}>
              <article className="surface-panel h-full rounded-3xl p-7">
                <p.icon className="size-8 text-primary" aria-hidden />
                <h3 className="mt-5 text-xl font-semibold">{p.role}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.frustration}</p>
                <p className="mt-4 text-sm font-medium text-accent">{p.outcome}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">What you unlock</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.name} delay={i * 80}>
              <article className="surface-panel h-full rounded-2xl p-6 transition-transform hover:-translate-y-1">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/15">
                  <f.icon className="size-5 text-primary" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{f.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.benefit}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <Reveal>
          <div className="surface-panel glow rounded-[2rem] px-8 py-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Press play on three free months
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              No ads, no shuffle-only, no commitment. Keep your playlists whatever you decide.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#start"
                className="rounded-full bg-primary px-8 py-3.5 font-semibold text-primary-foreground transition-transform hover:scale-105"
              >
                Start listening free
              </a>
              <a
                href="#faq"
                className="rounded-full border border-border px-8 py-3.5 font-semibold transition-colors hover:bg-secondary"
              >
                Compare plans
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" aria-hidden /> Cancel anytime
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" aria-hidden /> No card charged in trial
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" aria-hidden /> Works on every device
              </li>
            </ul>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Questions, answered</h2>
        </Reveal>
        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 40}>
              <details className="surface-panel group rounded-2xl px-6 py-5">
                <summary className="cursor-pointer list-none font-medium marker:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {f.q}
                    <span className="mt-0.5 text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <BookingSection />

      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        Resonance — sound without interruption.
      </footer>

      <ChatWidget />
    </main>
  );
}
