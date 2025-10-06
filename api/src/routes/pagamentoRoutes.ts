import { Router } from "express";
import * as pagamentoController from "../controllers/pagamentoController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pagamento:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do pagamento
 *           example: 1
 *         reservaId:
 *           type: integer
 *           description: ID da reserva associada
 *           example: 1
 *         valor:
 *           type: number
 *           format: float
 *           description: Valor do pagamento
 *           example: 500.00
 *         metodoPagamento:
 *           type: string
 *           enum: [CARTAO_CREDITO, CARTAO_DEBITO, PIX, DINHEIRO]
 *           description: Método de pagamento utilizado
 *           example: CARTAO_CREDITO
 *         status:
 *           type: string
 *           enum: [PENDENTE, CONCLUIDO, FALHOU]
 *           description: Status do pagamento
 *           example: CONCLUIDO
 *         dataPagamento:
 *           type: string
 *           format: date-time
 *           description: Data e hora do pagamento
 *           example: "2025-10-06T10:30:00.000Z"
 *     
 *     CreatePagamento:
 *       type: object
 *       required:
 *         - reservaId
 *         - valor
 *         - metodoPagamento
 *         - status
 *       properties:
 *         reservaId:
 *           type: integer
 *           description: ID da reserva
 *           example: 1
 *         valor:
 *           type: number
 *           format: float
 *           description: Valor do pagamento (deve ser positivo)
 *           example: 500.00
 *         metodoPagamento:
 *           type: string
 *           enum: [CARTAO_CREDITO, CARTAO_DEBITO, PIX, DINHEIRO]
 *           description: Método de pagamento
 *           example: CARTAO_CREDITO
 *         status:
 *           type: string
 *           enum: [PENDENTE, CONCLUIDO, FALHOU]
 *           description: Status do pagamento
 *           example: PENDENTE
 *     
 *     UpdatePagamento:
 *       type: object
 *       properties:
 *         reservaId:
 *           type: integer
 *           example: 1
 *         valor:
 *           type: number
 *           format: float
 *           example: 550.00
 *         metodoPagamento:
 *           type: string
 *           enum: [CARTAO_CREDITO, CARTAO_DEBITO, PIX, DINHEIRO]
 *           example: PIX
 *         status:
 *           type: string
 *           enum: [PENDENTE, CONCLUIDO, FALHOU]
 *           example: CONCLUIDO
 */

/**
 * @swagger
 * /pagamentos:
 *   get:
 *     summary: Lista todos os pagamentos
 *     description: Retorna todos os pagamentos com dados da reserva associada
 *     tags: [Pagamentos]
 *     responses:
 *       200:
 *         description: Lista de pagamentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pagamentos recuperados com sucesso"
 *                 pagamentos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pagamento'
 *             example:
 *               message: "Pagamentos recuperados com sucesso"
 *               pagamentos:
 *                 - id: 1
 *                   reservaId: 1
 *                   valor: 500.00
 *                   metodoPagamento: "CARTAO_CREDITO"
 *                   status: "CONCLUIDO"
 *                   dataPagamento: "2025-10-06T10:30:00.000Z"
 *                   reserva:
 *                     id: 1
 *                     status: "CONFIRMADA"
 *                     usuarioId: 1
 *                     veiculoId: 1
 *                     dataInicio: "2025-10-06T00:00:00.000Z"
 *                     dataFim: "2025-10-10T00:00:00.000Z"
 *                     precoTotal: 500.00
 */
router.get("/", pagamentoController.getAllPagamentos);

/**
 * @swagger
 * /pagamentos/{id}:
 *   get:
 *     summary: Busca um pagamento por ID
 *     description: Retorna um pagamento específico com dados da reserva associada
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pagamento
 *         example: 1
 *     responses:
 *       200:
 *         description: Pagamento encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pagamento 1 encontrado com sucesso"
 *                 pagamento:
 *                   $ref: '#/components/schemas/Pagamento'
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
 *         description: Pagamento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pagamento não encontrado"
 */
router.get("/:id", pagamentoController.getPagamento);

/**
 * @swagger
 * /pagamentos:
 *   post:
 *     summary: Cria um novo pagamento
 *     description: Cria um novo pagamento associado a uma reserva
 *     tags: [Pagamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePagamento'
 *           examples:
 *             cartaoCredito:
 *               summary: Pagamento com cartão de crédito
 *               value:
 *                 reservaId: 1
 *                 valor: 500.00
 *                 metodoPagamento: "CARTAO_CREDITO"
 *                 status: "PENDENTE"
 *             pix:
 *               summary: Pagamento via PIX
 *               value:
 *                 reservaId: 2
 *                 valor: 350.00
 *                 metodoPagamento: "PIX"
 *                 status: "CONCLUIDO"
 *             dinheiro:
 *               summary: Pagamento em dinheiro
 *               value:
 *                 reservaId: 3
 *                 valor: 200.00
 *                 metodoPagamento: "DINHEIRO"
 *                 status: "CONCLUIDO"
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pagamento criado com sucesso"
 *                 pagamento:
 *                   $ref: '#/components/schemas/Pagamento'
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
 *       500:
 *         description: Erro ao criar pagamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao criar pagamento"
 */
router.post("/", pagamentoController.createPagamento);

/**
 * @swagger
 * /pagamentos/{id}:
 *   put:
 *     summary: Atualiza um pagamento existente
 *     description: Atualiza os dados de um pagamento pelo ID
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pagamento
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePagamento'
 *           examples:
 *             atualizarStatus:
 *               summary: Atualizar status para concluído
 *               value:
 *                 reservaId: 1
 *                 valor: 500.00
 *                 metodoPagamento: "CARTAO_CREDITO"
 *                 status: "CONCLUIDO"
 *             atualizarValor:
 *               summary: Atualizar valor do pagamento
 *               value:
 *                 reservaId: 1
 *                 valor: 550.00
 *                 metodoPagamento: "CARTAO_CREDITO"
 *                 status: "PENDENTE"
 *             mudarMetodo:
 *               summary: Mudar método de pagamento
 *               value:
 *                 reservaId: 1
 *                 valor: 500.00
 *                 metodoPagamento: "PIX"
 *                 status: "PENDENTE"
 *     responses:
 *       200:
 *         description: Pagamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pagamento atualizado com sucesso"
 *                 pagamento:
 *                   $ref: '#/components/schemas/Pagamento'
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
router.put("/:id", pagamentoController.updatePagamento);

/**
 * @swagger
 * /pagamentos/{id}:
 *   delete:
 *     summary: Remove um pagamento
 *     description: Remove um pagamento do sistema pelo ID
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pagamento
 *         example: 1
 *     responses:
 *       204:
 *         description: Pagamento removido com sucesso (sem conteúdo)
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
 *         description: Pagamento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pagamento não encontrado"
 */
router.delete("/:id", pagamentoController.deletePagamento);

export default router;
