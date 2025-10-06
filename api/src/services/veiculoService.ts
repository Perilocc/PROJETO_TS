import prisma from "../db/prisma";
import { StatusVeiculo, Veiculo } from "../generated/prisma";

export const getAllVeiculos = async () => {
    return prisma.veiculo.findMany();
}

export const getVeiculoById = async (id: number): Promise<Veiculo | null> => {
    return prisma.veiculo.findUnique({ where: { id } });
}

export const createVeiculo = async (
    placa: string, 
    modelo: string,
    marca: string,
    ano: number,
    categoriaId: number,
    status: StatusVeiculo
): Promise<Veiculo> => {
    return prisma.veiculo.create({ 
        data: { 
            placa, 
            modelo, 
            marca, 
            ano, 
            categoriaId, 
            status
        } 
    });
};

export const updateVeiculo = async (id: number, data: Partial<Veiculo>): Promise<Veiculo> => {
    return prisma.veiculo.update({ where: { id }, data });
}

export const deleteVeiculo = async (id: number): Promise<void> => {
    await prisma.veiculo.delete({ where: { id } });
}