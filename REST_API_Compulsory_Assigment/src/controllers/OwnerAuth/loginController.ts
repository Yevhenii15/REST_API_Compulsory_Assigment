// imports
import { type Request, type Response } from "express";

import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

// Project imports
import { ownerModel } from "../../models/ownerModel";
import { Owner } from "../../interfaces/owner";
import { connect, disconnect } from "../../db/database";
import { validateOwnerLoginData } from "./validateController";
/**
 * Login an existing owner
 * @param req
 * @param res
 * @returns
 */
export async function loginOwner(req: Request, res: Response) {
  try {
    // validate owner login info
    const { error } = validateOwnerLoginData(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    // find the owner in the repository
    await connect();

    const owner: Owner | null = await ownerModel.findOne({
      email: req.body.email,
    });

    if (!owner) {
      res.status(400).json({ error: "Password or email is wrong." });
      return;
    } else {
      // create auth token and send it back

      const validPassword: boolean = await bcrypt.compare(
        req.body.password,
        owner.password
      );

      if (!validPassword) {
        res.status(400).json({ error: "Password or email is wrong." });
        return;
      }

      const ownerId: string = owner.id;
      const token: string = jwt.sign(
        {
          // payload
          name: owner.name,
          email: owner.email,
          id: ownerId,
        },
        process.env.TOKEN_SECRET as string,
        { expiresIn: "2h" }
      );

      // attach the token and send it back to the client
      res
        .status(200)
        .header("auth-token", token)
        .json({ error: null, data: { ownerId, token } });
    }
  } catch (error) {
    res.status(500).send("Error logging in owner. Error: " + error);
  } finally {
    await disconnect();
  }
}
