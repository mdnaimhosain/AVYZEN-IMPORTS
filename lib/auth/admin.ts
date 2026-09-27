import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "avyzen_admin_session";

// Secret salt for HMAC signing
const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || "avyzen-imports-secret-key-2026";

/**
 * Returns the configured admin password from environment variables,
 * or the default password if not explicitly set.
 */
export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "avyzen2026!";
}

/**
 * Generates a deterministic HMAC token for valid admin sessions
 */
export function generateAdminSessionToken(): string {
  const password = getAdminPassword();
  return crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(`admin-authenticated:${password}`)
    .digest("hex");
}

/**
 * Validates a session token
 */
export function verifyAdminSessionToken(token?: string | null): boolean {
  if (!token) return false;
  try {
    const expected = generateAdminSessionToken();
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Verifies submitted password against admin password
 */
export function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  const currentPassword = getAdminPassword();
  try {
    const a = Buffer.from(password.trim());
    const b = Buffer.from(currentPassword.trim());
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
