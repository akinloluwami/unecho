import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "90d";

interface TokenPayload {
  id: string;
}

export const createAuthToken = (id: string) => {
  const payload: TokenPayload = { id };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return token;
};

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded.id;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};
