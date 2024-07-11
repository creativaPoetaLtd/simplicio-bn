import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import AuthenticationRoute from "./routes/Authentication.js";
import churchRoutes from "./routes/church.js";
import userRoutes from "./routes/user.js";
import donateRoutes from './routes/donation.js';
import { handleStripeWebhook } from "./controllers/donation.controller.js";

const app = express();

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json({
  limit: "50mb",
  verify: (req, res, burf) => {
    req.rawBody = burf
  }
}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "simplicio APIs documentation",
      version: "1.0.0",
      description: "This is the documentation for APIs simplicio",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `${process.env.URL}`,
      },
    ],
  },
  apis: ["src/doc/*js"],
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/auth", AuthenticationRoute);
app.use("/church", churchRoutes);
app.use('/donate', donateRoutes)
app.use('/webhook', handleStripeWebhook)
app.use("/user", userRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to simplicio API",
  });
});
export { app };
