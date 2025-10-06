import { Router } from "express";
import userRoutes from "./userRoutes";
import veiculoRoutes from "./veiculoRoutes";
import categoriaRoutes from "./categoriaRoutes";
import reservaRoutes from "./reservaRoutes";
import pagamentoRoutes from "./pagamentoRoutes";

const routes = Router();

routes.use('/usuarios', userRoutes);
routes.use('/veiculos', veiculoRoutes);
routes.use('/categorias', categoriaRoutes);
routes.use('/reservas', reservaRoutes);
routes.use('/pagamentos', pagamentoRoutes);

export default routes;