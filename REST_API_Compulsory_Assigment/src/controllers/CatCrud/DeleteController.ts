import { Request, Response } from "express";
import { catModel } from "../../models/catModel";
import { connect, disconnect } from "../../db/database";

// Extend Request to include ownerId
interface AuthRequest extends Request {
  ownerId?: string;
}
/**
 * Deletes a cat by its ID if the requesting user is the owner
 */
export async function deleteCatById(req: AuthRequest, res: Response) {
  const id = req.params.id;

  if (!req.ownerId) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }

  try {
    await connect();

    const cat = await catModel.findById(id);

    if (!cat) {
      res.status(404).json({ error: `Cat with id ${id} not found.` });
      return;
    }

    if (cat._owner.toString() !== req.ownerId) {
      res
        .status(403)
        .json({
          error: "Permission denied. You can only delete your own cat.",
        });
      return;
    }

    await catModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Cat was successfully deleted." });
  } catch (err) {
    res.status(500).json({ error: "Error deleting cat by id.", details: err });
  } finally {
    await disconnect();
  }
}
