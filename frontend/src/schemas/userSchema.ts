import { z } from "zod";

export const registerSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirmação de senha é obrigatória"),
}).refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
