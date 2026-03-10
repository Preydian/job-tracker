"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookmarkletReceivePage() {
  const router = useRouter();

  useEffect(() => {
    function handler(e: MessageEvent) {
      if (e.data?.type !== "jobtracker-bookmarklet") return;

      // Acknowledge so the bookmarklet stops retrying
      if (e.source && "postMessage" in e.source) {
        (e.source as Window).postMessage(
          { type: "jobtracker-ack" },
          { targetOrigin: e.origin }
        );
      }

      // Store in sessionStorage for the extract form to pick up
      sessionStorage.setItem(
        "bookmarklet_data",
        JSON.stringify({ url: e.data.url, text: e.data.text })
      );

      router.push("/jobs/new?from=bookmarklet");
    }

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Receiving job posting data...</p>
    </div>
  );
}
