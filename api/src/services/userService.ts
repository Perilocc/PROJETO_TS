import { Usuario, Papel } from "../generated/prisma";
import prisma from "../db/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

const JWT_SECRET = process.env.JWT_SECRET

export async function autenticarUsuario(email: string, senha: string) {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) throw new Error("Usuário não encontrado");

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) throw new Error("Senha incorreta");

    const token = jwt.sign(
        { id: user.id, email: user.email, papel: user.papel },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    return { token, user };
}