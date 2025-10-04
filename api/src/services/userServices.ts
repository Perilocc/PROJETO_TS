import { Usuario, Papel } from "../generated/prisma";
import prisma from "../prisma";

export const getAllUsuarios = async (): Promise<Usuario[]> => {
    return prisma.usuario.findMany();
};

export const getUsuarioById = async (id: number): Promise<Usuario | null> => {
    return prisma.usuario.findUnique({ where: { id } });
};

export const createUsuario = async (
    nome: string, 
    email: string, 
    senha: string, 
    papel?: Papel
): Promise<Usuario> => {
    return prisma.usuario.create({ 
        data: { 
            nome, 
            email, 
            senha, 
            papel 
        } 
    });
};

export const updateUsuario = async (id: number, data: Partial<Usuario>): Promise<Usuario> => {
    return prisma.usuario.update({ where: { id }, data });
};

export const deleteUsuario = async (id: number): Promise<void> => {
    await prisma.usuario.delete({ where: { id } });
};
