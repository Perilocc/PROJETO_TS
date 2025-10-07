import prisma from "../db/prisma";
import { differenceInDays } from "date-fns";
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
): Promise<Reserva> => {
  const veiculo = await prisma.veiculo.findUnique({
    where: { id: veiculoId },
    select: { categoria: true },
  });
  
  if (!veiculo) {
    throw new Error("Veículo não encontrado");
  }

  const categoria = veiculo.categoria;
  const precoDiaria = categoria.precoDiaria;

  const diasReserva = differenceInDays(new Date(dataFim), new Date(dataInicio));
  if (diasReserva <= 0) {
    throw new Error("A data de término deve ser posterior à data de início");
  }

  const precoTotal = diasReserva * precoDiaria;

  return prisma.reserva.create({
    data: {
      usuarioId,
      veiculoId,
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
      precoTotal,
    },
    include: { usuario: true, veiculo: true }
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
