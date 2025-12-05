

export interface Veiculo {
    id: number;
    placa: string;
    modelo: string;
    marca: string;
    ano: number;
    status: string;
    categoria: {
        id: number;
        nome: string;
    };
    imagemUrl?: string;
}