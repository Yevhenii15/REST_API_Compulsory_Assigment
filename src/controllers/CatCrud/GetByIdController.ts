import { Request, Response } from "express";
import { catModel } from "../../modules/catModel";
import { connect, disconnect } from "../../db/database";

/**
 * Retrieves a cat by its id from the data sources
 * @param req
 * @param res
 */
export const getCatById = async (req: Request, res: Response) => {
  try {
    await connect();

    const id = req.params.id;
    const result = await catModel.find({ _id: id });

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving cat by id. Error: " + err);
  } finally {
    await disconnect();
  }
};
