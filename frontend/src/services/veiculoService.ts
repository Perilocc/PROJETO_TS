import api from "./api";

export const getVeiculos = async (token: string) => {
    const response = await api.get("/veiculos/", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}