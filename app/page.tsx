// app/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthButton } from "@/components/auth-button";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if(user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full border-b border-border/40 h-16 flex items-center">
        <div className="max-w-6xl mx-auto w-full px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Link href="/">🎂 TreatSplit</Link>
          </div>
          <div className="flex items-center gap-4">
            <AuthButton />
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto w-full px-4 py-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Split birthday treats & gifts with your team beautifully.
            </h1>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              TreatSplit helps your team plan birthday events, split bills fairly, track who has paid,
              and vote for food — all in one place, powered by Supabase & Next.js.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                href={user ? "/dashboard" : "/auth/login"}
                className="bg-primary text-primary-foreground hover:opacity-90 px-5 py-3 rounded-md font-medium"
              >
                {user ? "Go to Dashboard" : "Get Started – It’s Free"}
              </Link>
              <Link
                href="#features"
                className="px-5 py-3 rounded-md font-medium border hover:bg-muted"
              >
                See Features
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Built in a hackathon, designed to scale to SaaS-grade.
            </p>
          </div>

          {/* Right side hero mock / illustration placeholder */}
          <div className="hidden md:block">
            <div className="w-full h-[380px] rounded-xl border bg-muted flex items-center justify-center text-muted-foreground">
              (Put your product screenshot / mock here)
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border/40 py-20">
        <div className="max-w-6xl mx-auto w-full px-4">
          <h2 className="text-3xl font-bold mb-10">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              step="01"
              title="Create a team"
              description="Invite your colleagues to join your team in TreatSplit."
            />
            <StepCard
              step="02"
              title="Create an event"
              description="Pick the birthday person, choose participants, and set the split."
            />
            <StepCard
              step="03"
              title="Track & celebrate"
              description="Track payments, poll for the food, and enjoy the party."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/40 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto w-full px-4">
          <h2 className="text-3xl font-bold mb-10">Features you’ll love</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Split & track contributions"
              description="Know exactly how much each person owes and who has paid."
            />
            <FeatureCard
              title="Food voting"
              description="Let your team vote on the celebration meal — pizza vs sushi showdown."
            />
            <FeatureCard
              title="Role-less events"
              description="Anyone can create or help manage an event — no rigid permissions."
            />
            <FeatureCard
              title="Stats dashboard"
              description="Get quick stats on participation rate, collected amount, and more."
            />
            <FeatureCard
              title="SSO & Magic link with Supabase Auth"
              description="Secure and simple authentication out of the box."
            />
            <FeatureCard
              title="Edge functions & scheduled jobs (roadmap)"
              description="Automated notifications and reminders for upcoming birthdays."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 py-20">
        <div className="max-w-6xl mx-auto w-full px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to try TreatSplit?</h2>
          <p className="text-muted-foreground mb-8">
            Start planning better team birthday treats in minutes.
          </p>
          <Link
            href={user ? "/dashboard" : "/auth/login"}
            className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-3 rounded-md font-medium"
          >
            {user ? "Go to Dashboard" : "Sign up with Magic Link"}
          </Link>
        </div>
      </section>
    </main>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border p-6 bg-background">
      <div className="text-sm text-muted-foreground mb-2">Step {step}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border p-6 bg-background">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
