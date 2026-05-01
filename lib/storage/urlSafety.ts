const signedUrlQueryKeys = [
  "x-amz-signature",
  "x-amz-security-token",
  "x-amz-credential",
  "googleaccessid",
  "signature",
  "expires",
  "token",
  "se",
  "sig",
] as const;

function isPrivateHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  if (
    lower === "localhost" ||
    lower === "0.0.0.0" ||
    lower === "127.0.0.1" ||
    lower.endsWith(".local")
  ) {
    return true;
  }

  if (/^10\.\d+\.\d+\.\d+$/.test(lower)) {
    return true;
  }

  if (/^192\.168\.\d+\.\d+$/.test(lower)) {
    return true;
  }

  if (/^169\.254\.\d+\.\d+$/.test(lower)) {
    return true;
  }

  const match = lower.match(/^172\.(\d+)\.\d+\.\d+$/);
  return Boolean(match && Number(match[1]) >= 16 && Number(match[1]) <= 31);
}

function isPlaceholderHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  return (
    lower === "example.com" ||
    lower === "example.org" ||
    lower === "example.net" ||
    lower.endsWith(".example.com") ||
    lower.endsWith(".example.org") ||
    lower.endsWith(".example.net")
  );
}

export function analyzePublicAssetUrl(url: string | null | undefined) {
  if (!url) {
    return {
      ok: false,
      issues: ["Missing public URL."],
    };
  }

  try {
    const parsed = new URL(url);
    const issues: string[] = [];

    if (parsed.protocol !== "https:") {
      issues.push("URL must start with https://.");
    }

    if (isPrivateHostname(parsed.hostname)) {
      issues.push("URL points to a local or private hostname.");
    }

    if (isPlaceholderHostname(parsed.hostname)) {
      issues.push("URL points to a placeholder example domain instead of the real public asset host.");
    }

    if (
      [...parsed.searchParams.keys()].some((key) =>
        signedUrlQueryKeys.includes(key.toLowerCase() as (typeof signedUrlQueryKeys)[number]),
      )
    ) {
      issues.push("URL looks like a temporary signed/private asset URL.");
    }

    return {
      ok: issues.length === 0,
      issues,
    };
  } catch {
    return {
      ok: false,
      issues: ["URL is not a valid absolute URL."],
    };
  }
}
