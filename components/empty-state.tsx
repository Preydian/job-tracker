import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4">📋</div>
      <h3 className="text-lg font-medium">No jobs yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Start tracking your job applications by adding your first job posting.
      </p>
      <Link
        href="/jobs/new"
        className="mt-4 inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        Add Your First Job
      </Link>
    </div>
  );
}
