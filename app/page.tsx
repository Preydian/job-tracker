import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          JobTracker
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Paste a job posting URL and let AI extract the key details.
          Track your applications, save jobs for later, and stay organized
          throughout your job search.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login" className={buttonVariants({ size: "lg" })}>
            Get Started
          </Link>
        </div>
        <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">AI-Powered Extraction</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Paste a URL and instantly extract job title, company, salary, skills, and more.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Track Applications</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Mark jobs as saved, applied, interviewing, offer, or rejected.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Stay Organized</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              All your applications in one place. Filter, search, and never lose track.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
