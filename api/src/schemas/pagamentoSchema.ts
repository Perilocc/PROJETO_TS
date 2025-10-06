import { z } from 'zod';

export const createPagamentoSchema = z.object({
    reservaId: z.number().int().positive("ReservaId deve ser um número inteiro positivo"),
    valor: z.number().positive("Valor deve ser um número positivo"),
    metodoPagamento: z.enum(["CARTAO_CREDITO", "CARTAO_DEBITO", "PIX", "DINHEIRO"], {
        message: "Método de pagamento inválido"
    }),
    status: z.enum(["PENDENTE", "CONCLUIDO", "FALHOU"], {
        message: "Status inválido"
    })
});

export const updatePagamentoSchema = z.object({
    reservaId: z.number().int().positive().optional(),
    valor: z.number().positive().optional(),
    metodoPagamento: z.enum(["CARTAO_CREDITO", "CARTAO_DEBITO", "PIX", "DINHEIRO"]).optional(),
    status: z.enum(["PENDENTE", "CONCLUIDO", "FALHOU"]).optional()
});
