import jwt from "jsonwebtoken";
import { getCookie } from "./cookies";

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

export const getUserId = (request: Request) => {
  return getUserIdFromToken(getCookie(request, "unecho.auth-token")!)!;
};

export const getProjectId = (request: Request) => {
  return getCookie(request, "unecho.project-id")!;
};
