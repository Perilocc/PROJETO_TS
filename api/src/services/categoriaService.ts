import prisma from "../db/prisma";
import { Categoria } from "../generated/prisma";

export const getAllCategorias = async (): Promise<Categoria[]> => {
	return prisma.categoria.findMany({
		include: { 
			veiculos: true 
		}
	});
}

export const getCategoriaById = async (id: number): Promise<Categoria | null> => {
	return prisma.categoria.findUnique({ where: { id }, include: { veiculos: true } });
}

export const createCategoria = async (nome: string, precoDiaria: number): Promise<Categoria> => {
	return prisma.categoria.create({
		data: { nome, precoDiaria },
		include: { veiculos: true }
	});
}

export const updateCategoria = async (id: number, data: Partial<Categoria>): Promise<Categoria> => {
	return prisma.categoria.update({ where: { id }, data, include: { veiculos: true } });
}

export const deleteCategoria = async (id: number): Promise<void> => {
	await prisma.categoria.delete({ where: { id } });
}