import { Router, Request, Response } from "express";
// CRUD controllers
import { createCat } from "./controllers/CatCrud/CreateController";
import { getAllCats } from "./controllers/CatCrud/GetController";
import { getCatById } from "./controllers/CatCrud/GetByIdController";
import { getCatByQuery } from "./controllers/CatCrud/GetByQueryController";
import { updateCatById } from "./controllers/CatCrud/UpdateController";
import { deleteCatById } from "./controllers/CatCrud/DeleteController";
// Auth controllers
import { loginOwner } from "./controllers/OwnerAuth/loginController";
import { registerOwner } from "./controllers/OwnerAuth/registerController";
import { verifyToken } from "./controllers/OwnerAuth/verifyTokenController";
const router: Router = Router();

// get, post, put, delete (CRUD)

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the API");
});
// Cat CRUD
router.post("/cats", verifyToken, createCat);
router.put("/cats/:id", verifyToken, updateCatById);
router.delete("/cats/:id", verifyToken, deleteCatById);
// Cat Read
router.get("/cats", getAllCats);
router.get("/cats/:id", getCatById);
router.get("/cats/query/:key/:val", getCatByQuery);

// Owner Auth
router.post("/owner/register", registerOwner);
router.post("/owner/login", loginOwner);

export default router;
