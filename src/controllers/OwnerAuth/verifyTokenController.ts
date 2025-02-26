import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request to include ownerId
interface AuthRequest extends Request {
  ownerId?: string;
}

/**
 * Middleware to verify the client JWT token and attach the owner ID
 */
export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.header("auth-token");

  if (!token) {
    res.status(400).json({ error: "Access Denied." });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET as string) as {
      id: string;
    };

    (req as AuthRequest).ownerId = verified.id; // Attach the owner's ID

    next(); // Proceed to next middleware
  } catch {
    res.status(401).json({ error: "Invalid Token" });
  }
}
