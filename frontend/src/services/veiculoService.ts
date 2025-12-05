import api from "./api";

export const getVeiculos = async (token: string) => {
    const response = await api.get("/veiculos/", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const atualizarStatusVeiculo = async (
    veiculoId: number,
    status: "DISPONIVEL" | "LOCADO" | "MANUTENCAO",
    token: string
) => {
    const response = await api.put(
        `/veiculos/${veiculoId}`, 
        { status },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};
