import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAdminToken } from "./auth.js";

/** JSON gövdesini güvenle okur (Vercel çoğu zaman otomatik parse eder). */
export function readBody<T = Record<string, unknown>>(req: VercelRequest): T {
  if (!req.body) return {} as T;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body) as T;
    } catch {
      return {} as T;
    }
  }
  return req.body as T;
}

export function sendError(
  res: VercelResponse,
  status: number,
  message: string,
) {
  res.status(status).json({ error: message });
}

/**
 * Admin yetkisini doğrular. Authorization: Bearer <token> başlığını bekler.
 * Yetki yoksa 401 döner ve false verir.
 */
export async function requireAdmin(
  req: VercelRequest,
  res: VercelResponse,
): Promise<boolean> {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const ok = await verifyAdminToken(token);
  if (!ok) {
    sendError(res, 401, "Yetkisiz. Lütfen admin olarak giriş yapın.");
    return false;
  }
  return true;
}

/** Yöntem (GET/POST/...) kontrolü için yardımcı. */
export function methodNotAllowed(res: VercelResponse, allowed: string[]) {
  res.setHeader("Allow", allowed.join(", "));
  sendError(res, 405, "Bu yöntem desteklenmiyor.");
}
