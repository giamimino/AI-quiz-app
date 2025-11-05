import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET!

export function generateEmailToken(email: string) {
  return jwt.sign({ email }, secret, { expiresIn: "15m" })
}

export function verifyEmailToken(token: string) {
  try {
    return jwt.verify(token, secret) as { email: string }
  } catch (err) {
    if(err instanceof  jwt.TokenExpiredError) return { error: "Token expired." }
    return { error: "Invalid token." }
  }
}