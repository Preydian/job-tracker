import * as cheerio from "cheerio";

export async function scrapeJobPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove non-content elements
  $("script, style, nav, footer, header, iframe, noscript, svg, img").remove();
  $('[role="navigation"], [role="banner"], [role="contentinfo"]').remove();

  // Try to find the main content area
  const mainContent =
    $("main").text() ||
    $('[role="main"]').text() ||
    $("article").text() ||
    $(".job-description, .job-details, .posting-page, #job-content").text() ||
    $("body").text();

  const title = $("title").text().trim();

  // Clean up whitespace
  const cleanedText = mainContent
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();

  const result = title ? `Page Title: ${title}\n\n${cleanedText}` : cleanedText;

  // Truncate to ~15k characters to keep Claude costs reasonable
  return result.slice(0, 15000);
}
