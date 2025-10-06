import { ZodError } from "zod";

// Identifica se o erro é uma instância de ZodError
export function isZodError(error: unknown): error is ZodError {
    return error instanceof ZodError;
}

// Identifica se o erro é uma instância de Error
export function isError(error: unknown): error is Error {
    return error instanceof Error;
}

// Retorna mensagem de erro com base no tipo
export function getErrorDetails(error: unknown) {
    if (isZodError(error)) {
        return error.issues;
    }
    
    if (isError(error)) {
        return error.message;
    }
    
    return "Erro desconhecido";
}
