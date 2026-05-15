/**
 * בסיס כתובות ה־API — ניתן לדריסה עם REACT_APP_API_URL / REACT_APP_API_HTTP_URL
 * (קובץ .env בשורש frontend).
 */
function trimTrailingSlash(url) {
  return String(url || '').replace(/\/+$/, '');
}

export const API_BASE_URL = trimTrailingSlash(
  process.env.REACT_APP_API_URL || 'https://localhost:7223/api'
);

export const API_HTTP_FALLBACK_BASE = trimTrailingSlash(
  process.env.REACT_APP_API_HTTP_URL || 'http://localhost:5118/api'
);

function segmentUrl(base, segment) {
  const s = String(segment || '').replace(/^\/+/, '');
  return `${base}/${s}`;
}

/** GET — HTTPS ואז גיבוי HTTP (מתאים ל־dotnet עם redirect / תעודה מקומית). */
export async function axiosGetWithFallback(axiosInstance, segment, config) {
  const urls = [
    segmentUrl(API_BASE_URL, segment),
    segmentUrl(API_HTTP_FALLBACK_BASE, segment),
  ];
  let lastErr;
  for (let i = 0; i < urls.length; i += 1) {
    try {
      return await axiosInstance.get(urls[i], config);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/** POST — אותה לוגיקת גיבוי. */
export async function axiosPostWithFallback(
  axiosInstance,
  segment,
  body,
  config
) {
  const urls = [
    segmentUrl(API_BASE_URL, segment),
    segmentUrl(API_HTTP_FALLBACK_BASE, segment),
  ];
  let lastErr;
  const merged = {
    headers: { 'Content-Type': 'application/json' },
    ...config,
  };
  for (let i = 0; i < urls.length; i += 1) {
    try {
      return await axiosInstance.post(urls[i], body, merged);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/** PUT — גיבוי HTTPS / HTTP. */
export async function axiosPutWithFallback(
  axiosInstance,
  segment,
  body,
  config
) {
  const urls = [
    segmentUrl(API_BASE_URL, segment),
    segmentUrl(API_HTTP_FALLBACK_BASE, segment),
  ];
  let lastErr;
  const merged = {
    headers: { 'Content-Type': 'application/json' },
    ...config,
  };
  for (let i = 0; i < urls.length; i += 1) {
    try {
      return await axiosInstance.put(urls[i], body, merged);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/** DELETE — גיבוי HTTPS / HTTP. */
export async function axiosDeleteWithFallback(axiosInstance, segment, config) {
  const urls = [
    segmentUrl(API_BASE_URL, segment),
    segmentUrl(API_HTTP_FALLBACK_BASE, segment),
  ];
  let lastErr;
  for (let i = 0; i < urls.length; i += 1) {
    try {
      return await axiosInstance.delete(urls[i], config);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export function apiUrl(segment) {
  return segmentUrl(API_BASE_URL, segment);
}
