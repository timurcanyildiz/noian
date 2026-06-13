import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkPassword, createAdminToken } from "./_lib/auth";
import { readBody, sendError, methodNotAllowed } from "./_lib/http";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  const { password } = readBody<{ password?: string }>(req);
  if (!password) return sendError(res, 400, "Şifre gerekli.");

  if (!checkPassword(password)) {
    return sendError(res, 401, "Şifre hatalı.");
  }

  const token = await createAdminToken();
  res.status(200).json({ token });
}
