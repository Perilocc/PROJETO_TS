import { createPagamentoSchema, updatePagamentoSchema } from "../schemas/pagamentoSchema";
import * as pagamentoService from "../services/pagamentoService";
import { Request, Response } from "express";
import { getErrorDetails } from "../utils/errorHandlers";

export const getAllPagamentos = async (req: Request, res: Response) => {
  const pagamentos = await pagamentoService.getAllPagamentos();
  return res
    .status(200)
    .json({ message: "Pagamentos recuperados com sucesso", pagamentos });
}

export const getPagamento = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0)
    return res.status(400).json({ error: "ID inválido" });

  const pagamento = await pagamentoService.getPagamentoById(id);
  if (!pagamento) return res.status(404).json({ error: "Pagamento não encontrado" });

  return res
    .status(200)
    .json({ message: `Pagamento ${pagamento.id} encontrado com sucesso`, pagamento });
};

export const createPagamento = async (req: Request, res: Response) => {
  try {
    const data = createPagamentoSchema.parse(req.body);
    const novoPagamento = await pagamentoService.createPagamento(
        data.reservaId,
        data.valor,
        data.metodoPagamento,
        data.status
    );
    return res
      .status(201)
      .json({ message: "Pagamento criado com sucesso", pagamento: novoPagamento });
  } catch (error: unknown) {
    return res.status(400).json({
      error: "Erro na validação",
      details: getErrorDetails(error),
    });
  }
};

export const updatePagamento = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
        return res.status(400).json({ error: "ID inválido" });

    try {
        const data = updatePagamentoSchema.parse(req.body);
        const updatedPagamento = await pagamentoService.updatePagamento(id, data);
        return res
            .status(200)
            .json({ message: "Pagamento atualizado com sucesso", pagamento: updatedPagamento });
    } catch (error: unknown) {
        return res.status(400).json({
            error: "Erro na validação",
            details: getErrorDetails(error),
        });
    }
};

export const deletePagamento = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0)
    return res.status(400).json({ error: "ID inválido" });

  try {
    await pagamentoService.deletePagamento(id);
    return res.status(204).send();
  } catch {
    return res.status(404).json({ error: "Pagamento não encontrado" });
  }
};
