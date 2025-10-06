import { Router } from "express";
import {
 createVeiculo, 
 deleteVeiculo,
 getAllVeiculos,
 getVeiculo,
 updateVeiculo,
} from "../controllers/veiculoController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Veiculo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         placa:
 *           type: string
 *           example: "ABC1234"
 *         modelo:
 *           type: string
 *           example: "Compass"
 *         marca:
 *           type: string
 *           example: "Jeep"
 *         ano:
 *           type: integer
 *           example: 2024
 *         categoriaId:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           enum: [DISPONIVEL, LOCADO, MANUTENCAO]
 *           example: "DISPONIVEL"
 *         criadoEm:
 *           type: string
 *           format: date-time
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 *     CreateVeiculo:
 *       type: object
 *       required:
 *         - placa
 *         - modelo
 *         - marca
 *         - ano
 *         - categoriaId
 *       properties:
 *         placa:
 *           type: string
 *           minLength: 7
 *           maxLength: 7
 *           example: "ABC1234"
 *         modelo:
 *           type: string
 *           minLength: 1
 *           example: "Compass"
 *         marca:
 *           type: string
 *           minLength: 1
 *           example: "Jeep"
 *         ano:
 *           type: integer
 *           minimum: 1900
 *           example: 2024
 *         categoriaId:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         status:
 *           type: string
 *           enum: [DISPONIVEL, LOCADO, MANUTENCAO]
 *           example: "DISPONIVEL"
 *     UpdateVeiculo:
 *       type: object
 *       properties:
 *         placa:
 *           type: string
 *           minLength: 7
 *           maxLength: 7
 *           example: "XYZ1234"
 *         modelo:
 *           type: string
 *           minLength: 1
 *           example: "Renegade"
 *         marca:
 *           type: string
 *           minLength: 1
 *           example: "Jeep"
 *         ano:
 *           type: integer
 *           minimum: 1900
 *           example: 2023
 *         categoriaId:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         status:
 *           type: string
 *           enum: [DISPONIVEL, LOCADO, MANUTENCAO]
 *           example: "LOCADO"
 */

/**
 * @swagger
 * /veiculos:
 *   get:
 *     summary: Listar todos os veículos
 *     tags: [Veículos]
 *     responses:
 *       200:
 *         description: Lista de veículos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Veículos encontrados com sucesso"
 *                 veiculos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Veiculo'
 */
router.get("/", getAllVeiculos);

/**
 * @swagger
 * /veiculos/{id}:
 *   get:
 *     summary: Buscar veículo por ID
 *     tags: [Veículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do veículo
 *     responses:
 *       200:
 *         description: Veículo encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Veículo encontrado com sucesso"
 *                 veiculo:
 *                   $ref: '#/components/schemas/Veiculo'
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
 *         description: Veículo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Veículo não encontrado"
 */
router.get("/:id", getVeiculo);

/**
 * @swagger
 * /veiculos:
 *   post:
 *     summary: Criar novo veículo
 *     tags: [Veículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVeiculo'
 *     responses:
 *       201:
 *         description: Veículo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Veículo criado com sucesso"
 *                 veiculo:
 *                   $ref: '#/components/schemas/Veiculo'
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
 *                   example: [{"code": "too_small", "path": ["placa"], "message": "Placa deve ter no mínimo 7 caracteres"}]
 */
router.post("/", createVeiculo);

/**
 * @swagger
 * /veiculos/{id}:
 *   put:
 *     summary: Atualizar veículo
 *     tags: [Veículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do veículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVeiculo'
 *     responses:
 *       200:
 *         description: Veículo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Veículo atualizado com sucesso"
 *                 veiculo:
 *                   $ref: '#/components/schemas/Veiculo'
 *       400:
 *         description: ID inválido ou erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID inválido"
 *       404:
 *         description: Veículo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Veículo não encontrado"
 */
router.put("/:id", updateVeiculo);

/**
 * @swagger
 * /veiculos/{id}:
 *   delete:
 *     summary: Deletar veículo
 *     tags: [Veículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do veículo
 *     responses:
 *       204:
 *         description: Veículo deletado com sucesso
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
 *         description: Veículo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Veículo não encontrado"
 */
router.delete("/:id", deleteVeiculo);

export default router;