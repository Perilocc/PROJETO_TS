import { z } from "zod";

export const createReservaScherma = z.object({
  usariarioId: z.number().min(1, "ID do usuario é obrigatório."),
  veiculoId: z.number().min(1, "ID do veiculo é obrigatório."),
  dataInicio: z
    .string()
    .min(1, "Data de início obrigatória - Formato: Dia/Mes/Ano"),
  dataFim: z.string().min(1, "Data de fim obrigatória - Formato: Dia/Mes/Ano"),
  precoTotal: z.number().min(0).optional(),
});

export const updateReservaScherma = z.object({
  usuarioId: z.number().min(1).optional(),
  veiculoId: z.number().min(1).optional(),
  dataInicio: z.string().min(1).optional(),
  dataFim: z.string().min(1).optional(),
  precoTotal: z.number().min(0).optional(),
});
