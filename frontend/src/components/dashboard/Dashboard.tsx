"use client";

import { getVeiculos } from "@/services/veiculoService";
import { Veiculo } from "@/types/veiculos";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Lock, Wrench, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { criarCategoria } from "@/services/categoriaService";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrarTodasCategorias, setMostrarTodasCategorias] = useState(false);

    // Modal Categoria
    const [modalCategoriaAberto, setModalCategoriaAberto] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState("");
    const [precoDiaria, setPrecoDiaria] = useState("");
    const podeCriarCategoria = nomeCategoria.trim() !== "" && precoDiaria.trim() !== "" && parseFloat(precoDiaria) > 0;

    const handleCriarCategoria = async () => {
        if (!nomeCategoria || !precoDiaria) return;
        if (!session?.user?.id) return;

        try {
            const categoria = await criarCategoria(
                nomeCategoria,
                parseFloat(precoDiaria),
                session?.user?.token
            );
            console.log("Categoria criada:", categoria)

            setModalCategoriaAberto(false);
            setNomeCategoria("");
            setPrecoDiaria("");
            toast.success("Cadastro de Categoria realizado com sucesso!");
        } catch (error) {
            console.error("Erro ao criar Categoria:", error);
            toast.error("Houve um erro ao cadastrar uma Nova Categoria!");
        }
    };

    useEffect(() => {
        if (status === "loading") return;
        
        if (status !== "authenticated") {
            setLoading(false);
            setError("Você precisa estar autenticado");
            return;
        }   

        async function fetchVeiculos() {
            const token = session?.user?.token;

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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Bem-vindo */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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

                    {/* Ações Rápidas */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ações rápidas</h2>
                        <div className="flex flex-col gap-3">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow py-3 font-semibold transition cursor-pointer">
                                Criar Veículo
                            </button>
                            <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow py-3 font-semibold transition cursor-pointer"
                                onClick={() => {
                                    setModalCategoriaAberto(true);
                                }}
                            >
                                Criar Categoria
                            </button>
                            <button className="bg-purple-300 hover:bg-purple-400 text-gray-800 rounded-lg shadow py-3 font-semibold transition cursor-pointer">
                                Gerenciar Usuários
                            </button>
                        </div>
                    </div>
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

                {/* Veículos por categoria */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Veículos por categoria</h2>
                    <div className="space-y-3">
                        {Object.entries(resumoCategorias)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, mostrarTodasCategorias ? undefined : 3)
                            .map(([categoria, quantidade]) => (
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
                    {Object.entries(resumoCategorias).length > 3 && (
                        <button 
                            onClick={() => setMostrarTodasCategorias(!mostrarTodasCategorias)}
                            className="mt-4 w-full flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition"
                        >
                            {mostrarTodasCategorias ? (
                                <>
                                    Mostrar menos
                                    <ChevronUp className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    Mostrar todas ({Object.entries(resumoCategorias).length})
                                    <ChevronDown className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
            {/* Modal Criar Categoria */}
            {modalCategoriaAberto && (
                <Dialog 
                    open={modalCategoriaAberto} 
                    onOpenChange={(open) => {
                        setModalCategoriaAberto(open);
                        if (!open) {
                            setNomeCategoria("");
                            setPrecoDiaria("");
                        }
                    }}
                >
                    <DialogContent className="sm:max-w-md w-full">
                        <DialogHeader>
                            <DialogTitle className="w-full text-center">
                                Criar Nova Categoria
                            </DialogTitle>
                        </DialogHeader>

                        <div className="px-6 py-4 flex flex-col gap-4">
                            {/* Nome da Categoria */}
                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="nome-categoria"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Nome da Categoria
                                </label>
                                <input
                                    id="nome-categoria"
                                    type="text"
                                    value={nomeCategoria}
                                    onChange={(e) => setNomeCategoria(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Ex: SUV, Sedan, Hatch..."
                                />
                            </div>

                            {/* Preço Diária */}
                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="preco-diaria"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Preço da Diária (R$)
                                </label>
                                <input
                                    id="preco-diaria"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={precoDiaria}
                                    onChange={(e) => setPrecoDiaria(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="150.00"
                                />
                            </div>

                            {precoDiaria && parseFloat(precoDiaria) > 0 && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Valor formatado: {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    }).format(parseFloat(precoDiaria))}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <button
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-red-200 dark:hover:bg-red-700 rounded-lg transition"
                                onClick={
                                    () => {
                                        setModalCategoriaAberto(false)
                                        setNomeCategoria("");
                                        setPrecoDiaria("");
                                    }
                                }
                            >
                                Cancelar
                            </button>
                            <button
                                className={`
                                    px-5 py-2 
                                    bg-purple-600 
                                    hover:bg-purple-700
                                    rounded-lg
                                    shadow-lg
                                    text-white 
                                    text-sm font-semibold
                                    transition
                                    ${!podeCriarCategoria ? "opacity-50 cursor-not-allowed hover:bg-purple-600" : ""}
                                `}
                                onClick={handleCriarCategoria}
                                disabled={!podeCriarCategoria}
                            >
                                Criar Categoria
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}