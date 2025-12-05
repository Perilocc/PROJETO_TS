import api from "./api";

export const getClientes = async (token: string) => {
    const response = await api.get("/usuarios", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const userLogin = async (email: string, senha: string) => {
    const response = await api.post("/usuarios/login", { email, senha });
    return response.data;
};

export const userRegister = async (nome: string, email: string, senha: string, papel: string) => {
    const response = await api.post("/usuarios", { nome, email, senha, papel });
    return response.data;
};

