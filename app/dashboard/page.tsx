import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { JobCard } from "@/components/job-card";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import type { Job, JobStatus } from "@/lib/types";

interface DashboardPageProps {
  searchParams: Promise<{ status?: string }>;
}

const statusFilters: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const activeStatus = params.status || "all";
  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (activeStatus !== "all") {
    query = query.eq("status", activeStatus as JobStatus);
  }

  const { data: jobs } = await query;
  const typedJobs = (jobs ?? []) as Job[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Jobs</h1>
        <span className="text-sm text-muted-foreground">
          {typedJobs.length} {typedJobs.length === 1 ? "job" : "jobs"}
        </span>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg border bg-muted p-1">
        {statusFilters.map((filter) => (
          <Link
            key={filter.value}
            href={`/dashboard${filter.value === "all" ? "" : `?status=${filter.value}`}`}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeStatus === filter.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {typedJobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {typedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
