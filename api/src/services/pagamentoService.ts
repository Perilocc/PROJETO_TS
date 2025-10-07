import prisma from "../db/prisma";
import { MetodoPagamento, Pagamento, StatusPagamento } from "../generated/prisma";

export const getAllPagamentos = async (): Promise<Pagamento[]> => {
    return prisma.pagamento.findMany({
        include: { reserva: true }
    });
}

export const getPagamentoById = async (id: number): Promise<Pagamento | null> => {
    return prisma.pagamento.findUnique({ where: { id }, include: { reserva: true } });
}

export const createPagamento = async (
    reservaId: number,
    valor: number,
    metodoPagamento: MetodoPagamento,
    status: StatusPagamento
) => {
    return prisma.pagamento.create({
        data: {
            reservaId,
            valor,
            metodoPagamento,
            status
        },
        include: { reserva: true }
    });
}

export const updatePagamento = async (id: number, data: Partial<Pagamento>): Promise<Pagamento> => {
    return prisma.pagamento.update({ where: { id }, data, include: { reserva: true } });
}

export const deletePagamento = async (id: number): Promise<void> => {
    await prisma.pagamento.delete({ where: { id } });
}