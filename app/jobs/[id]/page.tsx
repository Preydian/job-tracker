import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusSelect } from "@/components/status-select";
import { JobNotes } from "@/components/job-notes";
import { DeleteJobButton } from "@/components/delete-job-button";
import { format } from "date-fns";
import type { Job } from "@/lib/types";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatSalary(min: number | null, max: number | null, currency: string): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `Up to ${fmt(max!)}`;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    notFound();
  }

  const job = data as Job;
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Dashboard
        </Link>
        <DeleteJobButton jobId={job.id} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl">{job.job_role}</CardTitle>
              <p className="mt-1 text-lg text-muted-foreground">{job.company_name}</p>
            </div>
            <StatusSelect jobId={job.id} currentStatus={job.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {job.location && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p>{job.location}</p>
              </div>
            )}
            {salary && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Salary</p>
                <p>{salary}</p>
              </div>
            )}
            {job.experience_years && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Experience</p>
                <p>{job.experience_years} years</p>
              </div>
            )}
            {job.date_posted && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date Posted</p>
                <p>{format(new Date(job.date_posted), "MMM d, yyyy")}</p>
              </div>
            )}
            {job.applied_at && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applied</p>
                <p>{format(new Date(job.applied_at), "MMM d, yyyy")}</p>
              </div>
            )}
          </div>

          {job.description_summary && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold">Summary</h3>
                <p className="text-sm text-muted-foreground">{job.description_summary}</p>
              </div>
            </>
          )}

          {job.required_skills && job.required_skills.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.required_skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <a
              href={job.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              View Original Posting &rarr;
            </a>
          </div>

          <Separator />

          <JobNotes jobId={job.id} initialNotes={job.notes} />

          <div className="text-xs text-muted-foreground">
            Added {format(new Date(job.created_at), "MMM d, yyyy 'at' h:mm a")}
            {job.updated_at !== job.created_at && (
              <> &middot; Updated {format(new Date(job.updated_at), "MMM d, yyyy 'at' h:mm a")}</>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
