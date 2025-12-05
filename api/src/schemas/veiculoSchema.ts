import { z } from "zod";

export const createVeiculoSchema = z.object({
    placa: z.string().length(7, "Placa deve ter exatamente 7 caracteres"),
    modelo: z.string().min(1, "Modelo é obrigatório"),
    marca: z.string().min(1, "Marca é obrigatória"),
    ano: z.number().int("Ano deve ser um número inteiro").min(1900, "Ano inválido").max(new Date().getFullYear() + 1, "Ano não pode ser no futuro"),
    categoriaId: z.number().int("CategoriaId deve ser um número inteiro").positive("CategoriaId deve ser positivo"),
    status: z.enum(["DISPONIVEL", "LOCADO", "MANUTENCAO"]).optional(),
    imagemUrl: z.string().url("A URL da imagem deve ser válida").optional()
});

export const updateVeiculoSchema = z.object({
    placa: z.string().min(7).max(7).optional(),
    modelo: z.string().min(1).optional(),
    marca: z.string().min(1).optional(),
    ano: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
    categoriaId: z.number().int().positive().optional(),
    status: z.enum(["DISPONIVEL", "LOCADO", "MANUTENCAO"]).optional(),
    imagemUrl: z.string().url("A URL da imagem deve ser válida").optional()
});