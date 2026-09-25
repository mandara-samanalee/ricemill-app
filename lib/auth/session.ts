import { cookies } from "next/headers"

const SESSION_COOKIE = "session"
const SESSION_MAX_AGE = 60 * 60 * 8 // 8 hours

export async function createSession(userId: number) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, String(userId), {
    httpOnly: true,
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession() {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value ?? null
}