/**
 * The one page-cache instance this site uses.
 *
 * Both halves must share it — the middleware that stores renders and the
 * control endpoint that triggers them read the same store, the same token and
 * the same event map. Two instances would each work in isolation and disagree
 * about everything that matters.
 */

import { pageCache, resolveCacheDirs } from "@tracht-digital-solutions/tds-shared/cache";

import { alwaysPaths, cacheEvents, contentCache } from "./cache";

export const siteCache = pageCache({
  // Creates the store and re-links it into the document root on every boot —
  // which every deploy triggers, and which is what makes the link survive a
  // deploy that wipes untracked files.
  ...resolveCacheDirs({ logger: (m) => console.warn(`[tds-landingpage] ${m}`) }),
  events: cacheEvents,
  alwaysPaths,
  // Without this a rebuild re-renders whatever the process read at boot and
  // reports success. It is the single most important line in this file.
  onInvalidate: () => contentCache.invalidate(),
  logger: (message) => console.warn(`[tds-landingpage] ${message}`),
});
