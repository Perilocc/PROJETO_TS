import express, { Express } from "express";
import 'dotenv/config';
import routes from "./routes";
import { setupSwagger } from "./swagger";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('', routes);

setupSwagger(app);

app.listen(port, () => {
    console.log(`🚀 API rodando em http://localhost:${port}`);
    console.log(`📚 Documentação Swagger: http://localhost:${port}/swagger`);
});

app.get("/", (req, res) => {
    res.send("Bem Vindo a nossa Locadora !!");
});