"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookmarkletPage() {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!linkRef.current) return;
    const origin = window.location.origin;
    const code = `javascript:void(function(){var t=document.body.innerText.substring(0,15000),u=location.href,w=window.open('${origin}/bookmarklet/receive');var a=0,i=setInterval(function(){try{w.postMessage({type:'jobtracker-bookmarklet',url:u,text:t},'${origin}')}catch(e){}a++;if(a>50)clearInterval(i)},100);window.addEventListener('message',function h(e){if(e.data&&e.data.type==='jobtracker-ack'){clearInterval(i);window.removeEventListener('message',h)}})})()`;
    // Set href via DOM to bypass React's javascript: URL blocking
    linkRef.current.setAttribute("href", code);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; Back to Dashboard
          </Link>
          <CardTitle className="mt-2 text-2xl">Bookmarklet Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">
              The bookmarklet lets you capture job postings from any site — even
              ones that block automated scraping (Seek, LinkedIn, etc). It runs
              in your browser so the site can&apos;t tell the difference.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">How to install</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                Drag the button below to your <strong>bookmarks bar</strong>.
                {" "}(If you don&apos;t see it, press <kbd className="rounded border px-1.5 py-0.5 text-xs">Ctrl+Shift+B</kbd>)
              </li>
              <li>Navigate to any job posting page.</li>
              <li>Click the <strong>&quot;Save to JobTracker&quot;</strong> bookmark.</li>
              <li>
                JobTracker opens in a new tab with the job details
                auto-extracted.
              </li>
            </ol>
          </div>

          <div className="flex justify-center rounded-lg border-2 border-dashed p-6">
            <a
              ref={linkRef}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm cursor-grab active:cursor-grabbing"
              title="Drag this to your bookmarks bar"
            >
              Save to JobTracker
            </a>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Drag the button above into your bookmarks bar
          </p>

          <div className="space-y-2">
            <h3 className="font-semibold">How it works</h3>
            <p className="text-sm text-muted-foreground">
              When you click the bookmarklet on a job posting page, it grabs the
              visible text content and sends it to JobTracker. Since it runs in
              your actual browser session, there are no bot-detection issues —
              the site sees your normal browser, not a server request.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
