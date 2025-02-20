import { Request, Response } from "express";
import { catModel } from "../../modules/catModel";
import { connect, disconnect } from "../../db/database";

/**
 * Retrieves a cat by its id from the data sources
 * @param req
 * @param res
 */
export async function updateCatById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await connect();

    const result = await catModel.findByIdAndUpdate(id, req.body);

    if (!result) {
      res.status(404).send("Cannot update cat with id=" + id);
    } else {
      res.status(200).send("Cat was succesfully updated.");
    }
  } catch (err) {
    res.status(500).send("Error updating cat by id. Error: " + err);
  } finally {
    await disconnect();
  }
}
