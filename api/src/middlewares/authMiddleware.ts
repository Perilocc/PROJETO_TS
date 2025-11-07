import { Request, Response, NextFunction } from "express";
import { verificarToken, JwtPayload } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
        user?: JwtPayload;
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    // Espera: Authorization: Bearer <token>
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token mal formatado" });
    }

    const decoded = verificarToken(token);

    if (!decoded) {
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }

    req.user = decoded;
    next();
}