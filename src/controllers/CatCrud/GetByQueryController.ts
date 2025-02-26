import { Request, Response } from "express";
import { catModel } from "../../models/catModel";
import { connect, disconnect } from "../../db/database";

export const getCatByQuery = async (req: Request, res: Response) => {
  const key = req.params.key;
  const val = req.params.val;

  try {
    await connect();

    const result = await catModel.find({
      [key]: { $regex: val, $options: "i" },
    });

    res.status(200).send(result);
  } catch {
    res.status(500).send("Error retrieving cat with id=" + req.params.id);
  } finally {
    await disconnect();
  }
};
