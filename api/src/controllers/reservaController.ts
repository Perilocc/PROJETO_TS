import * as reservaService from "../services/reservaService";
import {
  createReservaSchema,
  updateReservaSchema,
} from "../schemas/reservaSchema";
import { getErrorDetails } from "../utils/errorHandlers";
import { Request, Response } from "express";

export const getAllreservas = async (req: Request, res: Response) => {
  const reservas = await reservaService.getAllreservas();
  return res
    .status(200)
    .json({ message: "Reservas encontradas com sucesso", reservas });
};

export const getReserva = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const reserva = await reservaService.getReservaById(id);
  if (isNaN(id) || id <= 0)
    return res.status(400).json({ error: "ID inválido" });
  if (!reserva)
    return res.status(404).json({ error: "Reserva não encontrada" });
  return res
    .status(200)
    .json({ message: "Reserva encontrada com sucesso", reserva });
};

export const createReserva = async (req: Request, res: Response) => {
  try {
    const data = createReservaSchema.parse(req.body);
    const newReserva = await reservaService.createReserva(
      data.usuarioId,
      data.veiculoId,
      data.dataInicio,
      data.dataFim,
      data.status
    );
    return res
      .status(201)
      .json({ message: "Reserva criada com sucesso", reserva: newReserva });
  } catch (error: unknown) {
    return res.status(400).json({
      error: "Erro na validação",
      details: getErrorDetails(error),
    });
  }
};

export const updateReserva = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0)
    return res.status(400).json({ error: "ID inválido" });

  try {
    const data = updateReservaSchema.parse(req.body);
    const updateData = {
      ...data,
      dataInicio: data.dataInicio ? new Date(data.dataInicio) : undefined,
      dataFim: data.dataFim ? new Date(data.dataFim) : undefined,
    };
    const updatedReserva = await reservaService.updateReserva(id, updateData);
    return res.status(200).json({
      message: "Reserva atualizada com sucesso",
      reserva: updatedReserva,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      error: "Erro na validação",
      details: getErrorDetails(error),
    });
  }
};

export const deleteReserva = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0)
    return res.status(400).json({ error: "ID inválido" });

  try {
    await reservaService.deleteReserva(id);
    return res.status(204).send();
  } catch (error: unknown) {
    return res.status(400).json({
      error: "Erro na validação",
      details: getErrorDetails(error),
    });
  }
};
