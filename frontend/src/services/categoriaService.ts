import api from "./api";

export const getCategorias = async (token: string) => {
    const response = await api.get("/categorias", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const criarCategoria = async (
    nome: string,
    precoDiaria: number,
    token: string
) => {
    const response = await api.post("/categorias", {
        nome,
        precoDiaria
    },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
