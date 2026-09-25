import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma/client"

export async function verifyCredentials(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)

  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  }
}