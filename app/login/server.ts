'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const HARDCODED_USERNAME = "admin"
const HARDCODED_PASSWORD = "ricemill123"

export async function login(formData: FormData) {
  const username = formData.get("username")?.toString() ?? ""
  const password = formData.get("password")?.toString() ?? ""

  if (username !== HARDCODED_USERNAME || password !== HARDCODED_PASSWORD) {
    redirect("/login?error=1")
  }

  const cookieStore = await cookies()
  cookieStore.set("session", "authenticated", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  redirect("/dashboard")
}