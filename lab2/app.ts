import express, { Application } from "express";
import path from "path";
import apiRoutes from "./routes/api";

const app: Application = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", apiRoutes);

export default app;