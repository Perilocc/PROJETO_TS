"use client";

import { getVeiculos } from "@/services/veiculoService";
import { Categoria } from "@/types/categorias";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Veiculo } from "@/types/veiculos";
import { Lock, Wrench} from "lucide-react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale/pt-BR";
import { differenceInDays } from "date-fns";
import { MetodoPagamento } from "@/types/metodoPagamento";
import { criarReserva } from "@/services/reservaService";
import { atualizarStatusVeiculo } from "@/services/veiculoService";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function ListaVeiculos() {
    const { data: session, status } = useSession();
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [dataInicial, setDataInicial] = useState<Date | null>(null);
    const [dataFinal, setDataFinal] = useState<Date | null>(null);
    const diasReserva = dataInicial && dataFinal? differenceInDays(dataFinal, dataInicial): 0;
    const valorTotal = veiculoSelecionado && diasReserva > 0 
    ? diasReserva * veiculoSelecionado.categoria.precoDiaria 
    : 0;

    const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento | "">("");
    const podeConcluir = !!dataInicial && !!dataFinal && !!metodoPagamento;

    const handleLocar = async () => {
        if (!dataInicial || !dataFinal || !metodoPagamento) return;
        if (!session?.user?.id || !veiculoSelecionado) return;

        try {
            const reserva = await criarReserva(
                Number(session.user.id),
                veiculoSelecionado.id,
                dataInicial,
                dataFinal, 
                session?.user?.token
            );
            console.log("Reserva criada:", reserva);

            await atualizarStatusVeiculo(
                veiculoSelecionado.id,
                "LOCADO",
                session.user.token
            );

            setVeiculos((prev) =>
                prev.map((v) =>
                    v.id === veiculoSelecionado.id ? { ...v, status: "LOCADO" } : v
                )
            );
            setModalAberto(false)
            setDataInicial(null)
            setDataFinal(null)
            setMetodoPagamento("")
            toast.success("Locação realizada com sucesso!");
        } catch (error) {
            console.error("Erro ao criar reserva:", error);
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
                                        {veiculo.status === "MANUTENCAO" ? "MANUTENÇÃO" : veiculo.status}
                                    </span>
                                    {/* BOTÃO PARA LOCAR*/}

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
                                            onClick={() => {
                                                setVeiculoSelecionado(veiculo);
                                                setModalAberto(true);
                                            }}
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
        {veiculoSelecionado && (
            <Dialog 
                open={modalAberto} 
                onOpenChange={(open) => {
                    setModalAberto(open);

                    // Se fechou, limpa os campos
                    if (!open) {
                        setDataInicial(null);
                        setDataFinal(null);
                        setMetodoPagamento("");
                    }
                }}
            >
            <DialogContent className="sm:max-w-2xl w-full p-full">
                <DialogHeader>
                    <DialogTitle  className="w-full text-center" >
                        Locação - {veiculoSelecionado.modelo}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-6 flex flex-col gap-4">
                    {/* Data Inicial */}
                    <div className="flex flex-col w-full">
                    <label
                        htmlFor="data-inicial"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Data Inicial
                    </label>
                    <DatePicker
                        id="data-inicial"
                        selected={dataInicial}
                        onChange={(date: Date | null) => setDataInicial(date)}
                        className="w-full border rounded px-3 py-2"
                        dateFormat="dd/MM/yyyy"
                        locale={ptBR}
                    />
                    </div>

                    {/* Data Final */}
                    <div className="flex flex-col w-full">
                    <label
                        htmlFor="data-final"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Data Final
                    </label>
                    <DatePicker
                        id="data-final"
                        selected={dataFinal}
                        onChange={(date: Date | null) => setDataFinal(date)}
                        className="w-full border rounded px-3 py-2"
                        dateFormat="dd/MM/yyyy"
                        minDate={dataInicial || undefined}
                        locale={ptBR}
                    />
                    </div>
                </div>

                <div className="mt-4 flex flex-col w-full">
                    <label
                        htmlFor="metodo-pagamento"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Método de Pagamento
                    </label>
                    <select
                        id="metodo-pagamento"
                        value={metodoPagamento}
                        onChange={(e) => setMetodoPagamento(e.target.value as MetodoPagamento)}
                        className="w-full border rounded px-3 py-2 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <option value="">Selecione</option>
                        <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                        <option value="CARTAO_DEBITO">Cartão de Débito</option>
                        <option value="PIX">PIX</option>
                        <option value="DINHEIRO">Dinheiro</option>
                    </select>
                </div>

                {diasReserva > 0 && veiculoSelecionado && (
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                        Total da locação: {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        }).format(valorTotal)}
                    </p>
                )}

                <DialogFooter className="mt-4">
                <button
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-red-200 dark:hover:bg-red-700 rounded-lg transition"
                    onClick={
                        () => {
                            setModalAberto(false)
                            setDataInicial(null)
                            setDataFinal(null)
                            setMetodoPagamento("")
                        }
                    }
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
                        ${!podeConcluir ? "opacity-50 cursor-not-allowed hover:bg-blue-600" : ""}
                    `}
                    onClick={handleLocar}
                    disabled={!podeConcluir}
                >
                    Concluir Locação
                </button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        )}
    </div>
    );
}