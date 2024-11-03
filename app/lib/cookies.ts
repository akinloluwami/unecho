import { parse } from "cookie";

export function getCookie(request: Request, cookieName: string): string | null {
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = parse(cookieHeader);
  return cookies[cookieName] || null;
}
