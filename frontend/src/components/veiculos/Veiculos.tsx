"use client";

import { getVeiculos } from "@/services/veiculoService";
import { Categoria } from "@/types/categorias";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Veiculo } from "@/types/veiculos";
import { Lock, Wrench} from "lucide-react"

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
            categoria: item.categoria,
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
    <div className="w-full px-6 py-10">
        <h1 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">
            Frota de Veículos
        </h1>

        <div className="space-y-12">
            {Object.entries(categorias)
                    .sort(([, a], [, b]) => a.categoria.precoDiaria - b.categoria.precoDiaria)
                    .map(([categoria, dados] 
                ) => (
                <div key={categoria} className="space-y-4">
                    
                    {/* Cabeçalho da Categoria */}
                    <div className="flex items-center justify-between border-b pb-2">
                        <h2 className="text-2xl font-semibold">
                            {categoria}
                        </h2>

                        <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            }).format(dados.categoria.precoDiaria)}
                            <span className="text-gray-500 text-base"> /dia</span>
                        </span>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {/*flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory - carrosel*/}
                        {dados.lista.map((veiculo) => (
                            <div
                                key={veiculo.id}
                                className="border rounded-xl p-4 shadow-sm hover:shadow-lg transition hover:-translate-y-1 bg-white dark:bg-gray-900"
                            >
                                {/* Imagem */}
                                <div className="w-full h-36 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                    {veiculo.imagemUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={veiculo.imagemUrl}
                                            alt={`${veiculo.marca} ${veiculo.modelo}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-500 text-sm">Sem imagem</span>
                                    )}
                                </div>

                                {/* Título */}
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                    {`${veiculo.marca} - ${veiculo.modelo}`}
                                </h3>

                                {/* Infos */}
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Placa: <span className="font-medium">{veiculo.placa}</span>
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Ano: <span className="font-medium">{veiculo.ano}</span>
                                </p>

                                {/* Status */}
                                <div className="flex items-center justify-between mt-3">
                                    <span
                                        className={`
                                            inline-flex items-center gap-1 mt-3 px-2 py-1 text-xs rounded-full font-semibold uppercase tracking-wide
                                            ${
                                                veiculo.status === "DISPONIVEL"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : veiculo.status === "LOCADO"
                                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                            }
                                        `}
                                    >
                                        {veiculo.status === "MANUTENCAO" && <Wrench size={12} />}
                                        {veiculo.status === "LOCADO" && <Lock size={12} />}
                                        {veiculo.status}
                                    </span>
                                    {/* BOTÃO PARA LOCAR — aparece só se estiver disponível */}

                                    {veiculo.status === "DISPONIVEL" && (
                                        <button
                                            className="
                                                inline-flex items-center justify-center
                                                w-24  /* largura fixa */
                                                py-2
                                                text-sm font-semibold
                                                rounded-lg
                                                bg-blue-600 text-white
                                                hover:bg-blue-800
                                                shadow-xl 
                                                cursor-pointer
                                            "
                                            onClick={() => console.log(`Locar veículo ID ${veiculo.id}`)}
                                        >
                                            Locar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
}