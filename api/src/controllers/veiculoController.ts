import * as veiculoService from "../services/veiculoService";
import { createVeiculoSchema, updateVeiculoSchema } from "../schemas/veiculoSchema";
import { getErrorDetails } from "../utils/errorHandlers";
import { Request, Response } from "express";

export const getAllVeiculos = async (req: Request, res: Response) => {
	const veiculos = await veiculoService.getAllVeiculos();
	return res.status(200).json({ message: "Veículos encontrados com sucesso", veiculos });
};

export const getVeiculo = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	if (isNaN(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });

	const veiculo = await veiculoService.getVeiculoById(id);
	if (!veiculo) return res.status(404).json({ message: "Veículo não encontrado" });
	
	return res.status(200).json({ message: "Veículo encontrado com sucesso", veiculo });
};

export const createVeiculo = async (req: Request, res: Response) => {
	try {
		const data = createVeiculoSchema.parse(req.body);

		const newVeiculo = await veiculoService.createVeiculo(
			data.placa,
			data.modelo,
			data.marca,
			data.ano,
			data.categoriaId,
			data.status ?? "DISPONIVEL",
			data.imagemUrl
		);
		return res.status(201).json({ message: "Veículo criado com sucesso", veiculo: newVeiculo });
	} catch (error: unknown) {
		return res.status(400).json({ 
			error: "Erro na validação", 
			details: getErrorDetails(error) 
		});
	}
};

export const updateVeiculo = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	if (isNaN(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });

	try {
		const data = updateVeiculoSchema.parse(req.body);
		const updatedVeiculo = await veiculoService.updateVeiculo(id, data);
		return res.status(200).json({ message: "Veículo atualizado com sucesso", veiculo: updatedVeiculo });
	} catch (error: unknown) {
		return res.status(400).json({ 
			error: "Erro na validação", 
			details: getErrorDetails(error) 
		});
	}
};

export const deleteVeiculo = async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	if (isNaN(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });

	try {
		await veiculoService.deleteVeiculo(id);
		return res.status(204).send();
	} catch {
		return res.status(404).json({ error: "Veículo não encontrado" });
	}
};
