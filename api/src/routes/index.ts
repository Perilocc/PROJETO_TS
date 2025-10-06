import { Router } from "express";
import userRoutes from "./userRoutes";
import veiculoRoutes from "./veiculoRoutes";
import categoriaRoutes from "./categoriaRoutes";

const routes = Router();

routes.use('/usuarios', userRoutes);
routes.use('/veiculos', veiculoRoutes);
routes.use('/categorias', categoriaRoutes);

export default routes;