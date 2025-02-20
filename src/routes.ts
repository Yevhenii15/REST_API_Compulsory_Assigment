import { Router, Request, Response } from "express";
import { createCat } from "./controllers/CatCrud/CreateController";
import { getAllCats } from "./controllers/CatCrud/GetController";
import { getCatById } from "./controllers/CatCrud/GetByIdController";
import { getCatByQuery } from "./controllers/CatCrud/GetByQueryController";
const router: Router = Router();

// get, post, put, delete (CRUD)

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the API");
});
router.post("/cats", createCat);
router.get("/cats", getAllCats);
router.get("/cats/:id", getCatById);
router.get("/cats/query/:key/:val", getCatByQuery);

export default router;
