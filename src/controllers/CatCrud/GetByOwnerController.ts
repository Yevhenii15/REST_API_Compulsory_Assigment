import { Request, Response, NextFunction } from "express";
import { catModel } from "../../models/catModel"; // Adjust path as needed
import { connect, disconnect } from "../../db/database"; // Importing DB connection

/**
 * Retrieves cats for a specific owner
 * @param req
 * @param res
 */

export const getCatsByOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Connect to the database
    await connect();

    // Extract the ownerId from the request params
    const { ownerId } = req.params;

    // Find cats by ownerId
    const cats = await catModel.find({ _owner: ownerId });

    if (cats.length === 0) {
      res.status(404).json({ message: "No cats found for this owner." });
    } else {
      // Send the found cats as the response
      res.status(200).json(cats);
    }
  } catch (err) {
    // Pass the error to the next middleware (error handler)
    next(err);
  } finally {
    // Disconnect from the database
    await disconnect();
  }
};
