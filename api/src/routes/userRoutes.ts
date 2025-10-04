import { Router } from "express";
import {
    createUsuario, 
    updateUsuario, 
    deleteUsuario,
    getAllUsuarios, 
    getUsuario, 
} from "../controllers/userController";

const router = Router();

router.get("/", getAllUsuarios);
router.get("/:id", getUsuario);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

export default router;
