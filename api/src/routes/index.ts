import { Router } from "express";
import userRoutes from "./userRoutes";

const routes = Router();

routes.use('/usuarios', userRoutes);

export default routes;