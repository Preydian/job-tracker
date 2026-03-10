import { Badge } from "@/components/ui/badge";
import type { JobStatus } from "@/lib/types";

const statusConfig: Record<JobStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  saved: { label: "Saved", variant: "secondary" },
  applied: { label: "Applied", variant: "default" },
  interviewing: { label: "Interviewing", variant: "outline" },
  offer: { label: "Offer", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
