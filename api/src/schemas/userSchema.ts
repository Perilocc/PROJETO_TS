import { z } from "zod";

export const createUserSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    papel: z.enum(["CLIENTE", "GERENTE"]).optional()
});

export const updateUserSchema = z.object({
    nome: z.string().min(1).optional(),
    email: z.email().optional(),
    senha: z.string().min(6).optional(),
    papel: z.enum(["CLIENTE", "GERENTE"]).optional()
});
