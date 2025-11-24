import { authMiddleware } from "../middlewares/authMiddleware";
import pagamentoRoutes from "./pagamentoRoutes";
import categoriaRoutes from "./categoriaRoutes";
import veiculoRoutes from "./veiculoRoutes";
import reservaRoutes from "./reservaRoutes";
import userRoutes from "./userRoutes";
import { Router } from "express";
import { createUsuario, loginUsuario } from "../controllers/userController";

const routes = Router();

routes.post('/usuarios/login', loginUsuario);
routes.post('/usuarios', createUsuario);

routes.use(authMiddleware);

routes.use('/usuarios', userRoutes);
routes.use('/veiculos', veiculoRoutes);
routes.use('/categorias', categoriaRoutes);
routes.use('/reservas', reservaRoutes);
routes.use('/pagamentos', pagamentoRoutes);

export default routes;