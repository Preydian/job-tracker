"use client";

import { useState } from "react";
import Link from "next/link";
import { ExtractForm } from "@/components/extract-form";
import { ReviewExtractedJob } from "@/components/review-extracted-job";
import type { ExtractedJob } from "@/lib/types";

export default function NewJobPage() {
  const [extracted, setExtracted] = useState<ExtractedJob | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");

  const handleExtracted = (data: ExtractedJob, url: string) => {
    setExtracted(data);
    setSourceUrl(url);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Add a Job</h1>
        <p className="text-sm text-muted-foreground">
          Paste a job posting URL and we&apos;ll extract the details for you.
        </p>
      </div>

      {!extracted ? (
        <ExtractForm onExtracted={handleExtracted} />
      ) : (
        <ReviewExtractedJob
          data={extracted}
          sourceUrl={sourceUrl}
          onBack={() => setExtracted(null)}
        />
      )}
    </div>
  );
}
