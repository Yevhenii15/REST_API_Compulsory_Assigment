import { Request, Response } from "express";
import { catModel } from "../../models/catModel";
import { connect, disconnect } from "../../db/database";

// Extend Request to include ownerId
interface AuthRequest extends Request {
  ownerId?: string;
}

/**
 * Creates a new cat with the authenticated owner's ID
 */
export const createCat = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.ownerId) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }

  try {
    await connect();

    const cat = new catModel({ ...req.body, _owner: req.ownerId }); // Attach owner ID
    const result = await cat.save();

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error creating cat", details: err });
  } finally {
    await disconnect();
  }
};
