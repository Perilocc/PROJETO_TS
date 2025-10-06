import prisma from "../db/prisma";
import { Categoria } from "../generated/prisma";

export const getAllCategorias = async (): Promise<Categoria[]> => {
	return prisma.categoria.findMany();
}

export const getCategoriaById = async (id: number): Promise<Categoria | null> => {
	return prisma.categoria.findUnique({ where: { id } });
}

export const createCategoria = async (nome: string, precoDiaria: number): Promise<Categoria> => {
	return prisma.categoria.create({
		data: { nome, precoDiaria }
	});
}

export const updateCategoria = async (id: number, data: Partial<Categoria>): Promise<Categoria> => {
	return prisma.categoria.update({ where: { id }, data });
}

export const deleteCategoria = async (id: number): Promise<void> => {
	await prisma.categoria.delete({ where: { id } });
}