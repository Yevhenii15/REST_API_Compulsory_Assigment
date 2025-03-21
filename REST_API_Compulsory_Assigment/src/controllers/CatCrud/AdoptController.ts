import { Request, Response, NextFunction } from "express";
import { catModel } from "../../models/catModel";
import { connect, disconnect } from "../../db/database";

/**
 * Handles the adoption or transfer of a cat by an owner
 * @param req
 * @param res
 */
export const adoptCat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await connect();

    // Extract the cat ID and owner ID from the request
    const { catId } = req.params;
    const { ownerId } = req.body;

    // Find the cat by ID
    const cat = await catModel.findById(catId);

    // Check if the cat exists
    if (!cat) {
      res.status(404).json({ message: "Cat not found." });
      return;
    }

    // If the cat already has an owner, it's being transferred to a new owner
    if (cat._owner) {
      // Optionally, check if the new owner is different from the current one
      if (cat._owner === ownerId) {
        res
          .status(400)
          .json({ message: "You are already the owner of this cat." });
        return;
      }

      // Transfer the cat to the new owner
      cat._owner = ownerId;
      res
        .status(200)
        .json({ message: "Ownership transferred successfully.", cat });
    } else {
      // If the cat does not have an owner, it's available for adoption
      cat._owner = ownerId;
      res.status(200).json({ message: "Cat adopted successfully.", cat });
    }

    // Save the updated cat document
    await cat.save();
  } catch (err) {
    next(err);
  } finally {
    await disconnect();
  }
};
