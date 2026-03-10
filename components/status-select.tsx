"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateJobStatus } from "@/actions/jobs";
import type { JobStatus } from "@/lib/types";

const statuses: { value: JobStatus; label: string }[] = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export function StatusSelect({ jobId, currentStatus }: { jobId: string; currentStatus: JobStatus }) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: string | null) => {
    if (!value) return;
    startTransition(async () => {
      await updateJobStatus(jobId, value as JobStatus);
    });
  };

  return (
    <Select defaultValue={currentStatus} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
