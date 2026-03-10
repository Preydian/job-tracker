"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateJobNotes } from "@/actions/jobs";

export function JobNotes({ jobId, initialNotes }: { jobId: string; initialNotes: string | null }) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [saved, setSaved] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updateJobNotes(jobId, notes);
      setSaved(true);
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Notes</label>
      <Textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        placeholder="Add your personal notes about this job..."
        rows={4}
      />
      {!saved && (
        <Button size="sm" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Notes"}
        </Button>
      )}
    </div>
  );
}
