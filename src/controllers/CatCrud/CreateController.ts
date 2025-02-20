import { Request, Response } from "express";
import { catModel } from "../../modules/catModel";
import { connect, disconnect } from "../../db/database";

// CRUD - create, read/get, update, delete

/**
 * Creates a new product in the data source based on the request body
 * @param req
 * @param res
 */
export const createCat = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;

  try {
    await connect();

    const cat = new catModel(data);
    const result = await cat.save();

    res.status(201).send(result);
  } catch (err) {
    res.status(500).send("Error creating cat. Error: " + err);
  } finally {
    await disconnect();
  }
};
