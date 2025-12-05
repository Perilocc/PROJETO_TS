"use client";

import { getVeiculos } from "@/services/veiculoService";
import { Veiculo } from "@/types/veiculos";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Lock, Wrench, Truck } from "lucide-react";

export default function Dashboard() {
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

    const resumoVeiculos = veiculos.reduce(
        (acc, veiculo) => {
            switch (veiculo.status) {
                case "DISPONIVEL":
                    acc.disponiveis += 1;
                    break;
                case "LOCADO":
                    acc.locados += 1;
                    break;
                case "MANUTENCAO":
                acc.manutencao += 1;
                    break;
                default:
                    break;
            }
            return acc;
        },
        { disponiveis: 0, locados: 0, manutencao: 0 }
    );

    const resumoCategorias = veiculos.reduce(
        (acc, veiculo) => {
            const nomeCategoria = veiculo.categoria.nome;
            if (!acc[nomeCategoria]) {
                acc[nomeCategoria] = 0;
            }
            acc[nomeCategoria] += 1;
            return acc;
        },
        {} as Record<string, number>
    );


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
                </div>
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

    if (!session) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Painel de Gerenciamento
                </h1>

                {/* Bem-vindo */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <p className="text-gray-700 dark:text-gray-300">
                        Bem-vindo, <span className="font-semibold">{session.user.name}</span>!
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Email: {session.user.email}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Papel: {session.user.papel}
                    </p>
                </div>

                {/* Cards de resumo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-4">
                        <Truck className="text-green-500" />
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Disponíveis</p>
                            <p className="font-bold text-gray-900 dark:text-white">{resumoVeiculos.disponiveis}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-4">
                        <Lock className="text-red-500" />
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Locados</p>
                            <p className="font-bold text-gray-900 dark:text-white">{resumoVeiculos.locados}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-4">
                        <Wrench className="text-yellow-400" />
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Manutenção</p>
                            <p className="font-bold text-gray-900 dark:text-white">{resumoVeiculos.manutencao}</p>
                        </div>
                    </div>
                </div>
                {/* Cards por categoria*/}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Veículos por categoria</h2>
                    <div className="space-y-3">
                        {Object.entries(resumoCategorias).sort((a, b) => b[1] - a[1]).map(([categoria, quantidade]) => (
                            <div key={categoria} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <Truck className="text-white w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{categoria}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{quantidade}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                        {quantidade === 1 ? 'veículo' : 'veículos'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seção de ações rápidas */}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ações rápidas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow py-3 font-semibold">
                        Criar Veículo
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow py-3 font-semibold">
                        Criar Categoria
                    </button>
                    <button className="bg-purple-300 hover:bg-purple-400 text-gray-800 rounded-lg shadow py-3 font-semibold">
                        Gerenciar Usuários
                    </button>
                </div>

                {/* Tabela resumida de veículos */}
                {/*<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Veículos recentes</h3>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-300 dark:border-gray-700">
                                <th className="py-2 px-4 text-gray-700 dark:text-gray-400">Placa</th>
                                <th className="py-2 px-4 text-gray-700 dark:text-gray-400">Modelo</th>
                                <th className="py-2 px-4 text-gray-700 dark:text-gray-400">Status</th>
                                <th className="py-2 px-4 text-gray-700 dark:text-gray-400">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="py-2 px-4 text-gray-700 dark:text-gray-300">ABC-1234</td>
                                <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Corolla</td>
                                <td className="py-2 px-4 text-red-500 font-semibold">LOCADO</td>
                                <td className="py-2 px-4">
                                    <button className="text-blue-500 hover:underline">Editar</button>
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="py-2 px-4 text-gray-700 dark:text-gray-300">XYZ-9876</td>
                                <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Civic</td>
                                <td className="py-2 px-4 text-green-500 font-semibold">DISPONÍVEL</td>
                                <td className="py-2 px-4">
                                    <button className="text-blue-500 hover:underline">Editar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>*/}
            </div>
        </div>
    );
}