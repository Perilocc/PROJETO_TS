import prisma from "../db/prisma";
import { Reserva } from "../generated/prisma";

export const getAllreservas = async (): Promise<Reserva[]> => {
  return prisma.reserva.findMany();
};

export const getReservaById = async (id: number): Promise<Reserva | null> => {
  return prisma.reserva.findUnique({ where: { id } });
};

export const createReserva = async (
  usuarioId: number,
  veiculoId: number,
  dataInicio: string,
  dataFim: string,
  precoTotal?: number
): Promise<Reserva> => {
  return prisma.reserva.create({
    data: {
      usuarioId,
      veiculoId,
      dataInicio,
      dataFim,
      precoTotal,
    },
  });
};

export const updateReserva = async (
  id: number,
  data: Partial<Reserva>
): Promise<Reserva> => {
  return prisma.reserva.update({ where: { id }, data });
};

export const deleteReserva = async (id: number): Promise<void> => {
  await prisma.reserva.delete({ where: { id } });
};
