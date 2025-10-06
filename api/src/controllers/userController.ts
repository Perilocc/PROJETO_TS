import { createUserSchema, updateUserSchema } from "../schemas/userSchema";
import * as userService from "../services/userService";
import { getErrorDetails } from "../utils/errorHandlers";
import { Request, Response } from "express";

export const getAllUsuarios = async (req: Request, res: Response) => {
    const users = await userService.getAllUsuarios();
    return res.status(200).json({ message: "Usuários encontrados com sucesso", users });
};

export const getUsuario = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });

    const user = await userService.getUsuarioById(id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    return res.status(200).json({ message: `Usuário ${user.nome} encontrado com sucesso`, user });
};

export const createUsuario = async (req: Request, res: Response) => {
    try {
        const data = createUserSchema.parse(req.body); 
        const newUser = await userService.createUsuario(
            data.nome,
            data.email,
            data.senha,
            data.papel ?? "CLIENTE"
        );
        return res.status(201).json({ message: "Usuário criado com sucesso", user: newUser });
    } catch (error: unknown) {
        return res.status(400).json({ 
            error: "Erro na validação", 
            details: getErrorDetails(error) 
        });
    }
};

export const updateUsuario = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });

    try {
        const data = updateUserSchema.parse(req.body); 
        const updatedUser = await userService.updateUsuario(id, data);
        return res.status(200).json({ message: "Usuário atualizado com sucesso", user: updatedUser });
    } catch (error: unknown) {
        return res.status(400).json({ 
            error: "Erro na validação", 
            details: getErrorDetails(error) 
        });
    }
};

export const deleteUsuario = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });

    try {
        await userService.deleteUsuario(id);
        return res.status(204).send();
    } catch {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }
};
