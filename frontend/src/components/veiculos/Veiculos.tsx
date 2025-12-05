"use client";

import { getVeiculos } from "@/services/veiculoService";
import { Categoria } from "@/types/categorias";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Veiculo } from "@/types/veiculos";

export default function ListaVeiculos() {
    const { data: session, status } = useSession();
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (status === "loading") return;
        
        if (status !== "authenticated") {
            setLoading(false);
            setError("Você precisa estar autenticado");
            return;
        }   

        async function fetchVeiculos() {
            const token = session?.user?.token;
            console.log("Token de autenticação:", token);

            try {
                const response = await getVeiculos(token as string);
                console.log("Resposta da API de veículos:", response);
                setVeiculos(response.veiculos);
                setError(null);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error("Erro ao buscar veículos:", err);
                setError(
                    err.response?.data?.message || 
                    err.message || 
                    "Erro ao carregar veículos"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchVeiculos();
    }, [status, session]);

    const categorias = veiculos?.reduce((acc: Record<string, { categoria: Categoria; lista: Veiculo[] }>, item) => {
    const nomeCategoria = item.categoria.nome;

    if (!acc[nomeCategoria]) {
        acc[nomeCategoria] = {
            categoria: item.categoria,  // <-- agora salva o objeto completo
            lista: []
        };
    }

    acc[nomeCategoria].lista.push(item);
    return acc;
}, {});
    
    if (loading) {
        return (
            <div className="w-full px-6 py-8">
                <p className="text-center">Carregando veículos...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="w-full px-6 py-8">
                <p className="text-red-500 text-center">{error}</p>
            </div>
        );
    }

    if (veiculos?.length === 0) {
        return (
            <div className="w-full px-6 py-8">
                <p className="text-center text-gray-500">Nenhum veículo disponível</p>
            </div>
        );
    }

    return (
        <div className="w-full px-6 py-8">
            <h1 className="text-2xl font-bold mb-6">Veículos Disponíveis</h1>

            <div className="space-y-10">
                {Object.entries(categorias).map(([categoria, dados]) => (
                    <div key={categoria}>
                        <h2 className="text-xl font-semibold mb-4">
                            {categoria} -{" "}
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            }).format(dados.categoria.precoDiaria)}
                            <span className="text-gray-500 text-base"> /dia</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {dados.lista.map((veiculo) => (
                                <div
                                    key={veiculo.id}
                                    className="border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer bg-white dark:bg-gray-900"
                                >
                                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded mb-3 flex items-center justify-center">
                                        {veiculo.imagemUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={veiculo.imagemUrl}
                                                alt={`${veiculo.marca} ${veiculo.modelo}`}
                                                className="h-full object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-gray-500 text-sm">Sem imagem</span>
                                        )}
                                    </div>

                                    <h3 className="font-semibold text-lg">{`${veiculo.marca} ${veiculo.modelo}`}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Placa: {veiculo.placa}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Ano: {veiculo.ano}</p>
                                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                                        veiculo.status === 'disponivel' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                        {veiculo.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}