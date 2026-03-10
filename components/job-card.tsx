"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobStatusBadge } from "@/components/job-status-badge";
import { formatDistanceToNow } from "date-fns";
import type { Job } from "@/lib/types";

function formatSalary(min: number | null, max: number | null): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `Up to ${fmt(max!)}`;
}

export function JobCard({ job }: { job: Job }) {
  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="truncate text-base">{job.job_role}</CardTitle>
              <p className="text-sm text-muted-foreground">{job.company_name}</p>
            </div>
            <JobStatusBadge status={job.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {job.location && <span>{job.location}</span>}
            {salary && <span>{salary}</span>}
            {job.experience_years && <span>{job.experience_years} yrs</span>}
          </div>
          <p className="mt-2 text-xs text-muted-foreground" suppressHydrationWarning>
            Added {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
