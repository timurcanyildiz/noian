/**
 * Basit admin oturum yönetimi.
 * - Giriş: ADMIN_PASSWORD ile karşılaştırma
 * - Oturum: ADMIN_SESSION_SECRET ile imzalanmış JWT (jose)
 */
import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "degistir-bu-gizli-anahtari";
  return new TextEncoder().encode(secret);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  // ⚠️ ADMIN_PASSWORD tanımlı değilse (lokal geliştirme) "noian-admin" kabul edilir.
  const fallback = "noian-admin";
  return password === (expected || fallback);
}

export async function createAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
