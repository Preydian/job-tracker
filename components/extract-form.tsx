"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ExtractedJob } from "@/lib/types";

interface ExtractFormProps {
  onExtracted: (data: ExtractedJob, url: string) => void;
}

export function ExtractForm({ onExtracted }: ExtractFormProps) {
  const [url, setUrl] = useState("");
  const [manualText, setManualText] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Extraction failed");
        return;
      }

      onExtracted(data, url);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualExtract = async () => {
    if (!manualText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "manual://input", text: manualText }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Extraction failed");
        return;
      }

      onExtracted(data, url || "manual://input");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="job-url" className="text-sm font-medium">
          Job Posting URL
        </label>
        <div className="mt-1 flex gap-2">
          <Input
            id="job-url"
            type="url"
            placeholder="https://company.com/careers/job-posting"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleExtract} disabled={!url || loading}>
            {loading ? "Extracting..." : "Extract"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={() => setShowManual(!showManual)}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {showManual ? "Hide manual input" : "Or paste job description manually"}
        </button>
      </div>

      {showManual && (
        <div className="space-y-2">
          <Textarea
            placeholder="Paste the full job description here..."
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            rows={8}
            disabled={loading}
          />
          <Button
            onClick={handleManualExtract}
            disabled={!manualText.trim() || loading}
            variant="secondary"
            className="w-full"
          >
            {loading ? "Extracting..." : "Extract from Text"}
          </Button>
        </div>
      )}
    </div>
  );
}
