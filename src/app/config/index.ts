import express from "express";
import bodyParser from "body-parser";
import pool from "./database";
import cors from "cors";
import { AwilixContainer } from "awilix";
import { logger } from "../../config/logger";
import mainRoutes from "../../presentation/routes/routes";
import { errorMiddleware } from "../middleware/errorMiddleware";

export const startServer = async (container: AwilixContainer) => {
    const app = express();

    // CORS Configuration - Restricted to localhost only
    app.use(
        cors({
            origin: ["http://localhost", "http://localhost:3000"],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "x-last-watched"],
            exposedHeaders: ["Content-Range", "Accept-Ranges", "Content-Length"],
        })
    );

    app.use(bodyParser.json());

    app.use("/api", mainRoutes(container));
    app.use(errorMiddleware);

    // Attempt to connect to the database before starting the server
    try {
        await pool.connect();
        console.log("✅ Connected to PostgreSQL Database");
    } catch (error) {
        logger.error("❌ Database connection failed:", error);
        process.exit(1);
    }

    // Start the server
    try {
        const PORT = process.env.PORT;
        const server = app.listen(PORT, () => {
            console.log(`✅ Server running at http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
        });

        // Handle EADDRINUSE (Address already in use) error
        server.on("error", (error) => {
            if ((error as any).code === "EADDRINUSE") {
                logger.error(`❌ Port ${PORT} is already in use. Please stop the process using it or use a different port.`);
                process.exit(1);
            } else {
                logger.error("❌ Server error:", error);
                process.exit(1);
            }
        });

    } catch (error) {
        logger.error("❌ Server failed to start:", error);
        process.exit(1);
    }
};
