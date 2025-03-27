import { Router, Request, Response } from "express";
// CRUD controllers
import { createCat } from "./controllers/CatCrud/CreateController";
import { getAllCats } from "./controllers/CatCrud/GetController";
import { getCatsByOwner } from "./controllers/CatCrud/GetByOwnerController";
import { getCatById } from "./controllers/CatCrud/GetByIdController";
import { getCatByQuery } from "./controllers/CatCrud/GetByQueryController";
import { adoptCat } from "./controllers/CatCrud/AdoptController";
import { updateCatById } from "./controllers/CatCrud/UpdateController";
import { deleteCatById } from "./controllers/CatCrud/DeleteController";
// Auth controllers
import { loginOwner } from "./controllers/OwnerAuth/loginController";
import { registerOwner } from "./controllers/OwnerAuth/registerController";
import { verifyToken } from "./controllers/OwnerAuth/verifyTokenController";
import { startCron } from "./controllers/devToolsController";

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
  res.status(200).json({ message: "Welcome to the API" });
});


/**
 * @swagger
 * /start-cron:
 *   get:
 *     tags:
 *       - Start Cron Jobs
 *     summary: Starts the cron job that keep render alive
 *     description: Starts the cron job that keep render alive
 *     responses:
 *       200:
 *         description: Response from the cron job
 *         content:
 *           application/json:
 *             schema:
 *               type: array               
 */
router.get('/start-cron', startCron);

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
 * /owner/{ownerId}/cats:
 *   get:
 *     tags:
 *       - Cat Routes
 *     summary: List all cats for a specific owner
 *     description: Retrieves all cats owned by a specific owner using the owner's ID
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         description: The ID of the owner to retrieve cats for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the cats for the specified owner
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Cat"  # Assuming you have a 'Cat' schema defined in your Swagger components
 *       404:
 *         description: No cats found for the specified owner
 *       500:
 *         description: Internal server error occurred
 */
router.get("/owner/:ownerId/cats", getCatsByOwner);

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
 * /cats/adopt/{catId}:
 *   put:
 *     tags:
 *       - Cat Routes
 *     summary: Adopt a cat
 *     description: Allows an owner to adopt a specific cat by providing the owner's ID
 *     security:
 *      - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: catId
 *         required: true
 *         description: The ID of the cat being adopted
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerId:
 *                 type: string
 *                 description: The ID of the owner adopting the cat
 *     responses:
 *       200:
 *         description: Cat adopted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cat:
 *                   $ref: "#/components/schemas/Cat"
 *       400:
 *         description: Cat is already adopted
 *       404:
 *         description: Cat not found
 *       500:
 *         description: Internal server error
 */
router.put("/cats/adopt/:catId", verifyToken, adoptCat);

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
