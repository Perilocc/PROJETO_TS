import prisma from "../db/prisma";
import { Reserva } from "../generated/prisma";

export const getAllreservas = async (): Promise<Reserva[]> => {
  return prisma.reserva.findMany({
    include: { 
      usuario: true, 
      veiculo: true
    }
  });
};

export const getReservaById = async (id: number): Promise<Reserva | null> => {
  return prisma.reserva.findUnique({ where: { id }, include: { usuario: true, veiculo: true } });
};

export const createReserva = async (
  usuarioId: number,
  veiculoId: number,
  dataInicio: string,
  dataFim: string,
  precoTotal: number
): Promise<Reserva> => {
  return prisma.reserva.create({
    data: {
      usuarioId,
      veiculoId,
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
      precoTotal,
    },
  });
};

export const updateReserva = async (
  id: number,
  data: Partial<Reserva>
): Promise<Reserva> => {
  const updateData = {
    ...data,
    dataInicio: data.dataInicio ? new Date(data.dataInicio) : undefined,
    dataFim: data.dataFim ? new Date(data.dataFim) : undefined,
  };
  return prisma.reserva.update({ where: { id }, data: updateData, include: { usuario: true, veiculo: true } });
};

export const deleteReserva = async (id: number): Promise<void> => {
  await prisma.reserva.delete({ where: { id } });
};
