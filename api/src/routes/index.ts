import { Router } from "express";
import userRoutes from "./userRoutes";
import veiculoRoutes from "./veiculoRoutes";

const routes = Router();

routes.use('/usuarios', userRoutes);
routes.use('/veiculos', veiculoRoutes);

export default routes;