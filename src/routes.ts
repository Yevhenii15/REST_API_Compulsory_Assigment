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

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - App Routes
 *     summary: Health check
 *     description: Basic route to check if the API is running
 *     responses:
 *       200:
 *         description: Server up and running.
 */
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the API");
});

// Read routes

/**
 * @swagger
 * /cats:
 *   get:
 *     tags:
 *       - Cat Routes
 *     summary: Retrieve all cats
 *     description: Fetches all cats from the database
 *     responses:
 *       200:
 *         description: Successfully retrieved cats
 */
router.get("/cats", getAllCats);

/**
 * @swagger
 * /cats/{id}:
 *   get:
 *     tags:
 *       - Cat Routes
 *     summary: Get a cat by ID
 *     description: Retrieves a single cat using its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cat ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved cat
 */
router.get("/cats/:id", getCatById);

/**
 * @swagger
 * /cats/query/{key}/{val}:
 *   get:
 *     tags:
 *       - Cat Routes
 *     summary: Get cat by query
 *     description: Fetches a cat based on query parameters
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: Query key
 *         schema:
 *           type: string
 *       - in: path
 *         name: val
 *         required: true
 *         description: Query value
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved cat
 */
router.get("/cats/query/:key/:val", getCatByQuery);

// Create, Update, Delete routes

/**
 * @swagger
 * /cats:
 *   post:
 *     tags:
 *       - Cat Routes
 *     summary: Create a new cat
 *     description: Adds a new cat to the database
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Cat"
 *     responses:
 *       201:
 *         description: Cat created successfully
 */
router.post("/cats", verifyToken, createCat);

/**
 * @swagger
 * /cats/{id}:
 *   put:
 *     tags:
 *       - Cat Routes
 *     summary: Update a cat by ID
 *     description: Updates a specific cat based on its ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cat ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Cat"
 *     responses:
 *       200:
 *         description: Cat updated successfully
 */
router.put("/cats/:id", verifyToken, updateCatById);

/**
 * @swagger
 * /cats/{id}:
 *   delete:
 *     tags:
 *       - Cat Routes
 *     summary: Delete a cat by ID
 *     description: Deletes a cat from the database
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cat ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cat deleted successfully
 */
router.delete("/cats/:id", verifyToken, deleteCatById);

// Auth routes

/**
 * @swagger
 * /owner/register:
 *   post:
 *     tags:
 *       - Owner Routes
 *     summary: Register a new owner
 *     description: Registers a new owner in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Owner"
 *     responses:
 *       201:
 *         description: Owner created successfully
 */
router.post("/owner/register", registerOwner);

/**
 * @swagger
 * /owner/login:
 *   post:
 *     tags:
 *       - Owner Routes
 *     summary: Login owner
 *     description: Authenticates an owner and returns a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Owner"
 *     responses:
 *       200:
 *         description: Owner logged in successfully
 */
router.post("/owner/login", loginOwner);

export default router;
