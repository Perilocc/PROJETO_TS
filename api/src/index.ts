import userRoutes from "../src/routes/userRoutes";
import express, { Express } from "express";

const app: Express = express();
const port: Number = 3000;

app.use(express.json());
app.use("/usuarios", userRoutes);

app.listen(port, () => {
    console.log(`🚀 API rodando na porta ${port}`);
});

app.get("/", (req, res) => {
    res.send("Bem Vindo a nossa Locadora !!");
});