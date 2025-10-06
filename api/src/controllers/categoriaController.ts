
import { createCategoriaSchema, updateCategoriaSchema } from "../schemas/categoriaSchema";
import * as categoriaService from "../services/categoriaService";

import { getErrorDetails, isZodError } from "../utils/errorHandlers";
import { Request, Response } from "express";

export const getAllCategorias = async (req: Request, res: Response) => {
    const categorias = await categoriaService.getAllCategorias();
    return res.status(200).json({ message: "Categorias encontradas com sucesso", categorias });
};

export const getCategoria = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });

    const categoria = await categoriaService.getCategoriaById(id);
    if (!categoria) return res.status(404).json({ error: "Categoria não encontrada" });
    
    return res.status(200).json({ message: "Categoria encontrada com sucesso", categoria });
};

export const createCategoria = async (req: Request, res: Response) => {
    try {
        const data = createCategoriaSchema.parse(req.body);

        const newCategoria = await categoriaService.createCategoria(
            data.nome,
            data.precoDiaria
        );
        return res.status(201).json({ message: "Categoria criada com sucesso", categoria: newCategoria });
    } catch (error: unknown) {
        return res.status(400).json({ 
            error: "Erro na validação", 
            details: getErrorDetails(error) 
        });
    }
};

export const updateCategoria = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });

    try {
        const data = updateCategoriaSchema.parse(req.body);
        const updatedCategoria = await categoriaService.updateCategoria(id, data);
        return res.status(200).json({ message: "Categoria atualizada com sucesso", categoria: updatedCategoria });
    } catch (error: unknown) {
        if (isZodError(error)) {
            return res.status(400).json({ 
                error: "Erro na validação", 
                details: getErrorDetails(error) 
            });
        }
        return res.status(404).json({ error: "Categoria não encontrada" });
    }
};

export const deleteCategoria = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });

    try {
        await categoriaService.deleteCategoria(id);
        return res.status(204).send();
    } catch {
        return res.status(404).json({ error: "Categoria não encontrada" });
    }
};

