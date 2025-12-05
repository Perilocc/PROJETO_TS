"use client";

import { getVeiculos } from "@/services/veiculoService";
import { Veiculo } from "@/types/veiculos";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Lock, Wrench, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { criarCategoria, getCategorias } from "@/services/categoriaService";
import { criarVeiculo } from "@/services/veiculoService";
import { getClientes } from "@/services/authService";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Categoria } from "@/types/categorias";
import { Usuario } from "@/types/usuario";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [categorias,  setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrarTodasCategorias, setMostrarTodasCategorias] = useState(false);

    // Modal Veículo
    const [modalVeiculoAberto, setModalVeiculoAberto] = useState(false);
    const [placa, setPlaca] = useState("");
    const [modelo, setModelo] = useState("");
    const [marca, setMarca] = useState("");
    const [ano, setAno] = useState("");
    const [categoriaIdSelecionada, setCategoriaIdSelecionada] = useState("");
    const [imagemUrl, setImagemUrl] = useState("");

    const podeCriarVeiculo = (
        placa.trim() !== "" && 
        modelo.trim() !== "" && 
        marca.trim() !== "" && 
        ano.trim() !== "" && 
        parseInt(ano) > 1900 && 
        parseInt(ano) <= new Date().getFullYear() + 1 &&
        categoriaIdSelecionada !== "");
    
    const handleCriarVeiculo = async () => {
        if (!placa || !modelo || !marca || !ano || !categoriaIdSelecionada) return;
        if (!session?.user?.token) return;

        try {
            const veiculo = await criarVeiculo(
                placa.replace("-", ""),
                modelo,
                marca,
                parseInt(ano),
                parseInt(categoriaIdSelecionada),
                session.user.token,
                imagemUrl || null
            );
            console.log("Veículo criado:", veiculo);
            setModalVeiculoAberto(false);
            setPlaca("");
            setModelo("");
            setMarca("");
            setAno("");
            setCategoriaIdSelecionada("");
            setImagemUrl("");
            toast.success("Veículo cadastrado com sucesso!");
            
            // Recarregar sveículo
            const veiculosAtualizados = await getVeiculos(session.user.token);
            setVeiculos(veiculosAtualizados.veiculos);
            setError(null);
        } catch (error) {
            console.error("Erro completo:", error);
            toast.error("Erro ao criar veículo. Tente novamente!");
        }
    };

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

    // Modal de Clientes
    const [clientes,  setClientes] = useState<Usuario[]>([]);
    const [modalClientesAberto, setModalClientesAberto] = useState(false);
    const [loadingClientes, setLoadingClientes] = useState(false);

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
        
        const fetchCategorias = async () => {
            const catgs = await getCategorias(session.user.token);
            setCategorias(catgs.categorias);
        };

        const fetchClientes = async () => {
            console.log("🚀 Iniciando busca de clientes...");
            setLoadingClientes(true);
            try {
                const response = await getClientes(session.user.token);
                console.log(response);
                const usuarios = response.users;
                const clientesFiltrados = usuarios.reduce((acc: Usuario[], user: Usuario) => {
                    if (user.papel === "CLIENTE") {
                        acc.push(user);
                    }
                    return acc;
                }, []);
                
                console.log("✅ Clientes filtrados:", clientesFiltrados);
                setClientes(clientesFiltrados);
            } catch (error) {
                console.error("❌ Erro ao buscar clientes:", error);
                setClientes([]);
            } finally {
                setLoadingClientes(false);
            }
        };
        
        fetchVeiculos();
        fetchCategorias();
        fetchClientes()
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
                            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow py-3 font-semibold transition cursor-pointer"
                                onClick={() => {
                                    setModalVeiculoAberto(true);
                                }}
                            >
                                Criar Veículo
                            </button>
                            <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow py-3 font-semibold transition cursor-pointer"
                                onClick={() => {
                                    setModalCategoriaAberto(true);
                                }}
                            >
                                Criar Categoria
                            </button>
                            <button className="bg-purple-300 hover:bg-purple-400 text-gray-800 rounded-lg shadow py-3 font-semibold transition cursor-pointer"
                                onClick={() => {
                                    setModalClientesAberto(true);
                                }}
                            >
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
            {/* Modal Criar Veículo */}
            {modalVeiculoAberto && (
                <Dialog 
                    open={modalVeiculoAberto} 
                    onOpenChange={(open) => {
                        setModalVeiculoAberto(open);
                        if (!open) {
                            setPlaca("");
                            setModelo("");
                            setMarca("");
                            setAno("");
                            setCategoriaIdSelecionada("");
                            setImagemUrl("");
                        }
                    }}
                >
                    <DialogContent className="sm:max-w-md w-full">
                        <DialogHeader>
                            <DialogTitle className="w-full text-center">
                                Criar Novo Veículo
                            </DialogTitle>
                        </DialogHeader>

                        <div className="px-6 py-4 flex flex-col gap-4">
                            {/* Placa */}
                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="placa"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Placa
                                </label>
                                <input
                                    id="placa"
                                    type="text"
                                    value={placa}
                                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="ABC-1234"
                                    maxLength={8}
                                />
                            </div>

                            {/* Modelo */}
                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="modelo"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Modelo
                                </label>
                                <input
                                    id="modelo"
                                    type="text"
                                    value={modelo}
                                    onChange={(e) => setModelo(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Corolla, Civic, Onix..."
                                />
                            </div>

                            {/* Marca */}
                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="marca"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Marca
                                </label>
                                <input
                                    id="marca"
                                    type="text"
                                    value={marca}
                                    onChange={(e) => setMarca(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Toyota, Honda, Chevrolet..."
                                />
                            </div>

                            {/* Ano */}
                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="ano"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Ano
                                </label>
                                <input
                                    id="ano"
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    value={ano}
                                    onChange={(e) => setAno(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="2024"
                                />
                            </div>

                            {/* Categoria */}
                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="categoria"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Categoria
                                </label>
                                <select
                                    id="categoria"
                                    value={categoriaIdSelecionada}
                                    onChange={(e) => setCategoriaIdSelecionada(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* URL da Imagem (Opcional) */}
                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="imagem-url"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    URL da Imagem (opcional)
                                </label>
                                <input
                                    id="imagem-url"
                                    type="text"
                                    value={imagemUrl}
                                    onChange={(e) => setImagemUrl(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://exemplo.com/imagem.jpg"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <button
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-red-200 dark:hover:bg-red-700 rounded-lg transition"
                                onClick={() => {
                                    setModalVeiculoAberto(false);
                                    setPlaca("");
                                    setModelo("");
                                    setMarca("");
                                    setAno("");
                                    setCategoriaIdSelecionada("");
                                    setImagemUrl("");
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className={`
                                    px-5 py-2 
                                    bg-blue-600 
                                    hover:bg-blue-800
                                    rounded-lg
                                    shadow-xl
                                    text-white 
                                    text-sm font-semibold
                                    ${!podeCriarVeiculo ? "opacity-50 cursor-not-allowed hover:bg-blue-600" : ""}
                                `}
                                onClick={handleCriarVeiculo}
                                disabled={!podeCriarVeiculo}
                            >
                                Criar Veículo
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
            {/* Modal Listar Clientes */}
            {modalClientesAberto && (
                <Dialog 
                    open={modalClientesAberto} 
                    onOpenChange={(open) => setModalClientesAberto(open)}
                >
                    <DialogContent className="sm:max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="w-full text-center">
                                Lista de Clientes
                            </DialogTitle>
                        </DialogHeader>

                        <div className="px-6 py-4 flex-1 overflow-y-auto">
                            {loadingClientes ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                                </div>
                            ) : clientes.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400">Nenhum cliente encontrado</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-gray-300 dark:border-gray-700">
                                                <th className="py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">ID</th>
                                                <th className="py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Nome</th>
                                                <th className="py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clientes.map((cliente) => (
                                                <tr key={cliente.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{cliente.id}</td>
                                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{cliente.nome}</td>
                                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{cliente.email}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <button
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition"
                                onClick={() => setModalClientesAberto(false)}
                            >
                                Fechar
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}