import api from "./api";

export const criarReserva = async (
    usuarioId: number,
    veiculoId: number,
    dataInicio: Date,
    dataFim: Date,
    token: string
) => {
    const response = await api.post("/reservas", {
        usuarioId,
        veiculoId,
        dataInicio: dataInicio.toISOString().split("T")[0],
        dataFim: dataFim.toISOString().split("T")[0],
        status: "CONFIRMADA"
    },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
