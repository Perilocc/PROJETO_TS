import { z } from "zod";

export const createReservaSchema = z.object({
    usuarioId: z.number().min(1, "ID do usuário é obrigatório."),
    veiculoId: z.number().min(1, "ID do veículo é obrigatório."),
    dataInicio: z.string().min(1, "Data de início obrigatória - Formato: Dia/Mês/Ano"),
    dataFim: z.string().min(1, "Data de fim obrigatória - Formato: Dia/Mês/Ano"),
    precoTotal: z.number().min(0).optional(),
});

export const updateReservaSchema = z.object({
    usuarioId: z.number().min(1).optional(),
    veiculoId: z.number().min(1).optional(),
    dataInicio: z.string().min(1).optional(),
    dataFim: z.string().min(1).optional(),
    precoTotal: z.number().min(0).optional(),
});
