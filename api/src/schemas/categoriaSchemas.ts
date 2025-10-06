import { z } from "zod";

export const createCategoriaSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    precoDiaria: z.number().positive("Preço diária deve ser positivo")
});

export const updateCategoriaSchema = z.object({
    nome: z.string().min(1).optional(),
    precoDiaria: z.number().positive().optional()
});