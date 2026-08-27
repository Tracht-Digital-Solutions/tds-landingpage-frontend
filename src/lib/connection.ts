import {
  connectionStatusResponse,
  runtimeConfigResponse,
  siteConnection,
} from "@tracht-digital-solutions/tds-shared/connection";

const DEFAULT_API_BASE = "https://api.tracht-digital.de";

function buildApiBase(): string {
  const content =
    (import.meta.env.PUBLIC_CONTENT_API_URL as string | undefined) ?? `${DEFAULT_API_BASE}/content`;
  return content.trim().replace(/\/+$/, "").replace(/\/content$/, "") || DEFAULT_API_BASE;
}

export const connection = siteConnection({
  profile: "landingpage",
  fallbackApiBase: buildApiBase,
  fallbackSiteKey: () => process.env.TDS_SITE_KEY ?? "",
  fallbackCacheToken: () => process.env.TDS_CACHE_TOKEN ?? "",
  fallbackRuntime: () => {
    const apiBase = buildApiBase();
    return {
      apiBase,
      contactUrl: `${apiBase}/contact`,
      liveChatFrontend: "landingpage",
    };
  },
});

export const contentApiBase = (): string => `${connection.apiBase() || DEFAULT_API_BASE}/content`;
export const connectResponse = (request: Request): Promise<Response> => connection.handleConnect(request);
export const connectStatusResponse = (): Response => connectionStatusResponse(connection);
export const publicRuntimeResponse = (): Response => runtimeConfigResponse(connection);
