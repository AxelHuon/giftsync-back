import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Options de configuration pour swagger-jsdoc
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mon API",
      version: "2.0.0",
      description: "Documentation de l'API générée avec Swagger",
    },
    servers: [
      {
        url: "https://noel-listing-eu-c736376029b8.herokuapp.com",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts", "./src/models/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  // Route pour afficher le JSON Swagger directement
  app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Route pour l'interface Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
