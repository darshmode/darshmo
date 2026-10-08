/**
 * Carries tracking parameters through the booking funnel.
 *
 * The funnel spans three pages (/book -> /schedule -> /booked) and an
 * embedded third party widget, and each client side hop would otherwise drop
 * the query string. Rather than allowlisting specific keys, the whole query
 * string is forwarded, so utm_*, gclid, fbclid and anything added later all
 * survive without needing a code change.
 */

/** The current page's query string, or "" during SSR. */
export function currentSearch(): string {
  if (typeof window === "undefined") return "";
  return window.location.search;
}

/** Appends a query string to an internal path, skipping it when empty. */
export function withSearch(path: string, search: string): string {
  return search && search !== "?" ? `${path}${search}` : path;
}

/**
 * Maps utm_* query params onto the shape Calendly's embed API expects, so
 * bookings are attributed to the right source inside Calendly itself.
 * Returns undefined when there is nothing to pass.
 */
export function calendlyUtm(search: string): Record<string, string> | undefined {
  const params = new URLSearchParams(search);
  const pairs: [string, string][] = [
    ["utmSource", "utm_source"],
    ["utmMedium", "utm_medium"],
    ["utmCampaign", "utm_campaign"],
    ["utmContent", "utm_content"],
    ["utmTerm", "utm_term"],
  ];

  const utm: Record<string, string> = {};
  for (const [calendlyKey, queryKey] of pairs) {
    const value = params.get(queryKey);
    if (value) utm[calendlyKey] = value;
  }

  return Object.keys(utm).length > 0 ? utm : undefined;
}
