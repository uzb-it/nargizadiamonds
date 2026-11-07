import 'server-only';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSession, deleteSession, hasSession } from './db';

const COOKIE = 'nd_admin';
const MAX_AGE = 60 * 60 * 24 * 14;

// Without both values the admin panel stays closed. Changing either one signs everybody out.
function keys(): { password: string; secret: string } | null {
  const password = process.env.ADMIN_PASSWORD, secret = process.env.SESSION_SECRET;
  return password && secret ? { password, secret } : null;
}

function hash(token: string, k: { password: string; secret: string }): string {
  return crypto.createHmac('sha256', k.secret + k.password).update(token).digest('hex');
}

export function checkPassword(pw: string): boolean {
  const k = keys();
  if (!k) return false;
  const sha = (s: string) => crypto.createHash('sha256').update(s).digest();
  return crypto.timingSafeEqual(sha(pw), sha(k.password));
}

export async function startSession() {
  const k = keys();
  if (!k) throw new Error('ADMIN_PASSWORD and SESSION_SECRET are required');
  const token = crypto.randomBytes(32).toString('hex');
  await createSession(hash(token, k), MAX_AGE);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: MAX_AGE,
  });
}

export async function endSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value, k = keys();
  if (token && k) await deleteSession(hash(token, k));
  store.delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value, k = keys();
  return !!token && !!k && hasSession(hash(token, k));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login');
}
