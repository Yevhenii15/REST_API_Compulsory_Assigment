import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import { testConnection } from "./db/database";
import routes from "./routes";

dotenvFlow.config();

// Create express application
const app: Application = express();

/**
 * Starts the Express server
 */
export const startServer = () => {
  app.use(express.json());
  // Bind the routes to the application
  app.use("/api", routes);

  // Test the connection to the database
  testConnection();

  // Start the server
  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, () =>
    console.log(`Server is up and running on port: ${PORT}`)
  );
};
