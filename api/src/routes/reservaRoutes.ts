import { Router } from "express";
import * as reservaController from "../controllers/reservaController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Reserva:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único da reserva
 *           example: 1
 *         status:
 *           type: string
 *           enum: [PENDENTE, CONFIRMADA, CANCELADA, CONCLUIDA]
 *           description: Status da reserva
 *           example: CONFIRMADA
 *         usuarioId:
 *           type: integer
 *           description: ID do usuário que fez a reserva
 *           example: 1
 *         veiculoId:
 *           type: integer
 *           description: ID do veículo reservado
 *           example: 1
 *         dataInicio:
 *           type: string
 *           format: date-time
 *           description: Data de início da reserva
 *           example: "2024-01-15T00:00:00.000Z"
 *         dataFim:
 *           type: string
 *           format: date-time
 *           description: Data de término da reserva
 *           example: "2024-01-20T00:00:00.000Z"
 *         precoTotal:
 *           type: number
 *           format: float
 *           nullable: true
 *           description: Preço total da reserva
 *           example: 500.00
 * 
 *     CreateReserva:
 *       type: object
 *       required:
 *         - usuarioId
 *         - veiculoId
 *         - dataInicio
 *         - dataFim
 *         - precoTotal
 *       properties:
 *         usuarioId:
 *           type: integer
 *           description: ID do usuário que faz a reserva
 *           example: 1
 *         veiculoId:
 *           type: integer
 *           description: ID do veículo a ser reservado
 *           example: 1
 *         dataInicio:
 *           type: string
 *           description: Data de início da reserva no formato YYYY-MM-DD (exatamente 10 caracteres)
 *           pattern: '^\d{4}-\d{2}-\d{2}$'
 *           example: "2025-01-15"
 *         dataFim:
 *           type: string
 *           description: Data de término da reserva no formato YYYY-MM-DD (exatamente 10 caracteres)
 *           pattern: '^\d{4}-\d{2}-\d{2}$'
 *           example: "2025-01-20"
 *         precoTotal:
 *           type: number
 *           format: float
 *           description: Preço total da reserva (deve ser positivo)
 *           minimum: 0.01
 *           example: 500.00
 *     
 *     UpdateReserva:
 *       type: object
 *       properties:
 *         usuarioId:
 *           type: integer
 *           example: 1
 *         veiculoId:
 *           type: integer
 *           example: 2
 *         dataInicio:
 *           type: string
 *           description: Data de início no formato YYYY-MM-DD
 *           pattern: '^\d{4}-\d{2}-\d{2}$'
 *           example: "2025-01-16"
 *         dataFim:
 *           type: string
 *           description: Data de término no formato YYYY-MM-DD
 *           pattern: '^\d{4}-\d{2}-\d{2}$'
 *           example: "2025-01-21"
 *         precoTotal:
 *           type: number
 *           format: float
 *           minimum: 0
 *           example: 600.00
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Lista todas as reservas
 *     description: Retorna todas as reservas com dados relacionados (usuário, veículo com categoria, e pagamento)
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservas encontradas com sucesso"
 *                 reservas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reserva'
 *             example:
 *               message: "Reservas encontradas com sucesso"
 *               reservas:
 *                 - id: 1
 *                   status: CONFIRMADA
 *                   usuarioId: 1
 *                   veiculoId: 1
 *                   dataInicio: "2025-01-15T00:00:00.000Z"
 *                   dataFim: "2025-01-20T00:00:00.000Z"
 *                   precoTotal: 500.00
 *                   usuario:
 *                     id: 1
 *                     nome: "João Silva"
 *                     email: "joao@example.com"
 *                     papel: "CLIENTE"
 *                   veiculo:
 *                     id: 1
 *                     placa: "ABC1D23"
 *                     modelo: "Gol"
 *                     marca: "Volkswagen"
 *                     ano: 2023
 *                     status: "LOCADO"
 *                     categoriaId: 1
 *                     categoria:
 *                       id: 1
 *                       nome: "Econômico"
 *                       precoDiaria: 100.00
 *                   pagamento:
 *                     id: 1
 *                     reservaId: 1
 *                     valor: 500.00
 *                     metodoPagamento: "CARTAO_CREDITO"
 *                     status: "CONCLUIDO"
 *                     dataPagamento: "2024-01-15T10:30:00.000Z"
 */
router.get("/", reservaController.getAllreservas);

/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Busca uma reserva por ID
 *     description: Retorna uma reserva específica com dados relacionados (usuário, veículo com categoria, e pagamento)
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da reserva
 *         example: 1
 *     responses:
 *       200:
 *         description: Reserva encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reserva encontrada com sucesso"
 *                 reserva:
 *                   $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID inválido"
 *       404:
 *         description: Reserva não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Reserva não encontrada"
 */
router.get("/:id", reservaController.getReserva);

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Cria uma nova reserva
 *     description: Cria uma nova reserva no sistema
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReserva'
 *           examples:
 *             reservaCompleta:
 *               summary: Reserva com preço total
 *               value:
 *                 usuarioId: 1
 *                 veiculoId: 1
 *                 dataInicio: "2025-01-15"
 *                 dataFim: "2025-01-20"
 *                 precoTotal: 500.00
 *             reservaEconomica:
 *               summary: Reserva econômica
 *               value:
 *                 usuarioId: 2
 *                 veiculoId: 3
 *                 dataInicio: "2025-01-22"
 *                 dataFim: "2025-01-25"
 *                 precoTotal: 300.00
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reserva criada com sucesso"
 *                 reserva:
 *                   $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro na validação"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                       message:
 *                         type: string
 */
router.post("/", reservaController.createReserva);

/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Atualiza uma reserva existente
 *     description: Atualiza os dados de uma reserva pelo ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da reserva
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReserva'
 *           examples:
 *             atualizarDatas:
 *               summary: Atualizar datas
 *               value:
 *                 dataInicio: "2025-01-16"
 *                 dataFim: "2025-01-21"
 *             atualizarPreco:
 *               summary: Atualizar preço
 *               value:
 *                 precoTotal: 600.00
 *             atualizarVeiculo:
 *               summary: Trocar veículo
 *               value:
 *                 veiculoId: 2
 *     responses:
 *       200:
 *         description: Reserva atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reserva atualizada com sucesso"
 *                 reserva:
 *                   $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: ID inválido ou erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.put("/:id", reservaController.updateReserva);

/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Remove uma reserva
 *     description: Remove uma reserva do sistema pelo ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da reserva
 *         example: 1
 *     responses:
 *       204:
 *         description: Reserva removida com sucesso (sem conteúdo)
 *       400:
 *         description: ID inválido ou erro ao remover
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID inválido"
 */
router.delete("/:id", reservaController.deleteReserva);

export default router;
