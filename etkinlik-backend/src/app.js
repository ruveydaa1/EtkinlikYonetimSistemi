import express from "express";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js"
import venueRoutes from "./routes/venueRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import registirationRoutes from "./routes/registrationRoutes.js"
import ticketRoutes from "./routes/ticketRoutes.js"

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Etkinlik Yönetim Sistemi API çalışıyor."
    });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/categories", categoryRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/registrations" , registirationRoutes);
app.use("/api/tickets" , ticketRoutes);

export default app;