import { Router, Request, Response } from "express";
import { createCat } from "./controllers/CatCrud/CreateController";
const router: Router = Router();

// get, post, put, delete (CRUD)

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the API");
});
router.post("/cats", createCat);

export default router;
