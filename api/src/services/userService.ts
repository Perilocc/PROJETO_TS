import bcrypt from "bcrypt";
import prisma from "../db/prisma";
import { Usuario, Papel } from "../generated/prisma";

export const getAllUsuarios = async () => {
    return prisma.usuario.findMany({
        select: {
            id: true,
            nome: true,
            email: true,
            papel: true,
            criadoEm: true,
            atualizadoEm: true
        }
    });
};

export const getUsuarioById = async (id: number) => {
    return prisma.usuario.findUnique({ 
        where: { id },
        select: {
            id: true,
            nome: true,
            email: true,
            papel: true,
            criadoEm: true,
            atualizadoEm: true
        }
    });
};

export const createUsuario = async (
    nome: string, 
    email: string, 
    senha: string, 
    papel?: Papel
): Promise<Omit<Usuario, 'senha'>> =>  {
    const senhaHash = await bcrypt.hash(senha, 10);

    return prisma.usuario.create({ 
        data: { 
            nome, 
            email, 
            senha: senhaHash, 
            papel 
        },
        select: {
            id: true,
            nome: true,
            email: true,
            papel: true,
            criadoEm: true,
            atualizadoEm: true
        }
    });
};

export const updateUsuario = async (id: number, data: Partial<Usuario>) => {
    if (data.senha) {
        data.senha = await bcrypt.hash(data.senha, 10);
    }
    
    return prisma.usuario.update({ 
        where: { id }, 
        data,
        select: {
            id: true,
            nome: true,
            email: true,
            papel: true,
            criadoEm: true,
            atualizadoEm: true
        }
    });
};

export const deleteUsuario = async (id: number): Promise<void> => {
    await prisma.usuario.delete({ where: { id } });
};
