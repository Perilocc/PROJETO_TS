import jwt, { SignOptions, JwtPayload as DefaultJwtPayload, Secret } from "jsonwebtoken";

export interface JwtPayload extends DefaultJwtPayload {
  id: string;
  email: string;
  papel?: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definido nas variáveis de ambiente.");
}

const secretKey: Secret = JWT_SECRET; // tipagem correta

export function gerarToken(payload: JwtPayload): string {
  // 🔧 Força o tipo do expiresIn para StringValue (string literal)
  const expiresIn = (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"];

  const options: SignOptions = { expiresIn };

  // ✅ payload precisa ser um objeto
  return jwt.sign(payload as object, secretKey, options);
}

export function verificarToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch {
    return null;
  }
}
