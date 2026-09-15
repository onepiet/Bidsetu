import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.AUTH_SECRET || "bidsetu-secure-secret-key-2026-onebuilds";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  organizationId?: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signJwtToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyJwtToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function getAuthenticatedUser(req: NextRequest): TokenPayload | null {
  // Check cookie first
  const cookieToken = req.cookies.get("bidsetu_auth_token")?.value;
  if (cookieToken) {
    const verified = verifyJwtToken(cookieToken);
    if (verified) return verified;
  }

  // Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return verifyJwtToken(token);
  }

  return null;
}

export function requireAuth(
  req: NextRequest,
  allowedRoles?: string[]
): { user: TokenPayload } | { errorResponse: NextResponse } {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required to access this resource" } },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: `Role '${user.role}' is not authorized for this operation`,
          },
        },
        { status: 403 }
      ),
    };
  }

  return { user };
}

export function verifyOrgAccess(user: TokenPayload, targetOrgId?: string): boolean {
  if (user.role === "ADMIN") return true;
  if (!targetOrgId || !user.organizationId) return true;
  return user.organizationId === targetOrgId;
}

