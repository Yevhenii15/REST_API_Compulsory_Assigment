import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { ownerModel } from "../../models/ownerModel";
import { connect, disconnect } from "../../db/database";
import { validateOwnerRegistrationData } from "./validateController";
/**
 * Register a new owner
 * @param req
 * @param res
 * @returns
 */
export async function registerOwner(req: Request, res: Response) {
  try {
    // validate the owner and password info
    const { error } = validateOwnerRegistrationData(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    await connect();

    // check if the email is already registered
    const emailExists = await ownerModel.findOne({ email: req.body.email });

    if (emailExists) {
      res.status(400).json({ error: "Email already exists." });
      return;
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(req.body.password, salt);

    // create a owner object and save in the DB
    const ownerObject = new ownerModel({
      name: req.body.name,
      email: req.body.email,
      password: passwordHashed,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    });

    const savedOwner = await ownerObject.save();
    res.status(200).json({ error: null, data: savedOwner._id });
  } catch (error) {
    res.status(500).send("Error registrering owner. Error: " + error);
  } finally {
    await disconnect();
  }
}
