import { authMiddleware } from "../middlewares/authMiddleware";
import pagamentoRoutes from "./pagamentoRoutes";
import categoriaRoutes from "./categoriaRoutes";
import veiculoRoutes from "./veiculoRoutes";
import reservaRoutes from "./reservaRoutes";
import userRoutes from "./userRoutes";
import { Router } from "express";

const routes = Router();

routes.use('/usuarios', userRoutes);
routes.use(authMiddleware);

routes.use('/veiculos', veiculoRoutes);
routes.use('/categorias', categoriaRoutes);
routes.use('/reservas', reservaRoutes);
routes.use('/pagamentos', pagamentoRoutes);

export default routes;