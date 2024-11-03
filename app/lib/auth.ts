import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "90d";

interface TokenPayload {
  id: string;
}

export async function createAuthToken(id: string): Promise<string> {
  const payload: TokenPayload = { id };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return token;
}
