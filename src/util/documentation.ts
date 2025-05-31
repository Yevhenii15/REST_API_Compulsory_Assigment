import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Application } from "express";

/**
 * Setup Swagger documentation
 * @param app
 */
export function setupDocs(app: Application) {
  // swagger definition
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Cat API",
      version: "1.0.0",
      description: "API documentation for managing cats and owners.",
    },
    servers: [
      {
        url: "http://localhost:4000/api/",
        description: "Local development server",
      },
      {
        url: "https://cats-api-kpb3.onrender.com/api",
        description: "Online development server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "auth-token",
        },
      },
      schemas: {
        Cat: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 3, maxLength: 15 },
            age: { type: "number", minimum: 0, maximum: 30 },
            breed: { type: "string", minLength: 3, maxLength: 50 },
            color: { type: "string", minLength: 3, maxLength: 50 },
            weight: { type: "number", minimum: 0, maximum: 30 },
            isVaccinated: { type: "boolean" },
            birthDate: { type: "string", format: "date-time" },
            _owner: { type: "string", description: "Reference to Owner ID" },
          },
          required: [
            "name",
            "age",
            "breed",
            "color",
            "weight",
            "isVaccinated",
            "birthDate",
            "_owner",
          ],
        },
        Owner: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 3, maxLength: 50 },
            email: {
              type: "string",
              format: "email",
              minLength: 5,
              maxLength: 255,
            },
            password: { type: "string", minLength: 8, maxLength: 255 },
            phoneNumber: { type: "string", description: "Unique phone number" },
            address: { type: "string" },
          },
          required: ["name", "email", "password", "phoneNumber", "address"],
        },
        Login: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8, maxLength: 255 },
          },
          required: ["email", "password"],
        },
      },
    },
  };

  // swagger options
  const options = {
    swaggerDefinition,
    // Path to the files containing OpenAPI definitions
    apis: ["**/*.ts"],
  };

  // swagger spec
  const swaggerSpec = swaggerJSDoc(options);

  // create docs route
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
