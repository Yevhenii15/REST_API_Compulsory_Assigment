import { Request, Response } from "express";
import { catModel } from "../../modules/catModel";
import { connect, disconnect } from "../../db/database";

// CRUD - create, read/get, update, delete

/**
 * Creates a new product in the data source based on the request body
 * @param req
 * @param res
 */
export const getAllCats = async (req: Request, res: Response) => {
  try {
    await connect();

    const result = await catModel.find({});

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving cats. Error: " + err);
  } finally {
    await disconnect();
  }
};
