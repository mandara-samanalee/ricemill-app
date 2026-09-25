'use server'

import { redirect } from "next/navigation"
import { loginSchema } from "@/lib/validators/authSchema"
import { verifyCredentials } from "@/lib/services/authService"
import { createSession } from "@/lib/auth/session"

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    redirect("/login?error=1")
  }

  const user = await verifyCredentials(parsed.data.username, parsed.data.password)

  if (!user) {
    redirect("/login?error=1")
  }

  await createSession(user.id)
  redirect("/dashboard")
}

export async function logout() {
  const { destroySession } = await import("@/lib/auth/session")
  await destroySession()
  redirect("/login")
}