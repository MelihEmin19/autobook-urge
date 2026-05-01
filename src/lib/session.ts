import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

/**
 * iron-session içinde tutulan kullanıcı oturum verisi.
 * Sadece oturum açık adminler için doldurulur.
 */
export type SessionData = {
  userId?: number;
  email?: string;
  name?: string;
};

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_PASSWORD ??
    "autobook-default-cookie-password-change-me-32-chars",
  cookieName: "autobook_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
};

/**
 * Mevcut HTTP isteğine ait oturumu döner.
 * Server Component, Route Handler veya Server Action içinden çağrılabilir.
 *
 * @returns IronSession<SessionData>
 */
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
