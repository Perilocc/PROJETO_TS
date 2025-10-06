import { Router } from "express";
import {
    createCategoria,
    deleteCategoria,
    getAllCategorias,
    getCategoria,
    updateCategoria,
} from "../controllers/categoriaController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: "SUV"
 *         precoDiaria:
 *           type: number
 *           format: float
 *           example: 150.00
 *     CreateCategoria:
 *       type: object
 *       required:
 *         - nome
 *         - precoDiaria
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 1
 *           example: "SUV"
 *         precoDiaria:
 *           type: number
 *           format: float
 *           minimum: 0
 *           example: 150.00
 *     UpdateCategoria:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 1
 *           example: "SUV Premium"
 *         precoDiaria:
 *           type: number
 *           format: float
 *           minimum: 0
 *           example: 200.00
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categorias encontradas com sucesso"
 *                 categorias:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Categoria'
 */
router.get("/", getAllCategorias);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria encontrada com sucesso"
 *                 categoria:
 *                   $ref: '#/components/schemas/Categoria'
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
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Categoria não encontrada"
 */
router.get("/:id", getCategoria);

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Criar nova categoria
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoria'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria criada com sucesso"
 *                 categoria:
 *                   $ref: '#/components/schemas/Categoria'
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
 *                   example: [{"code": "too_small", "path": ["nome"], "message": "Nome é obrigatório"}]
 */
router.post("/", createCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoria'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria atualizada com sucesso"
 *                 categoria:
 *                   $ref: '#/components/schemas/Categoria'
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
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Categoria não encontrada"
 */
router.put("/:id", updateCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Deletar categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da categoria
 *     responses:
 *       204:
 *         description: Categoria deletada com sucesso
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
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Categoria não encontrada"
 */
router.delete("/:id", deleteCategoria);

export default router;
