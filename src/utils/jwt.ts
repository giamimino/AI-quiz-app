import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET!

export function generateEmailToken(email: string) {
  return jwt.sign({ email }, secret, { expiresIn: "15m" })
}

export function unCodeToken(token: string) {
  try {
    const decoded = jwt.decode(token)
    if(!decoded) return { error: "Unable to decode token" }
    return decoded
  } catch (err) {
    console.log(err);
    
    return { error: "Failed to decode token" }
  }
}

export function verifyEmailToken(token: string) {
  try {
    return jwt.verify(token, secret) as { email: string }
  } catch (err) {
    if(err instanceof  jwt.TokenExpiredError) return { error: "Token expired." }
    return { error: "Invalid token." }
  }
}