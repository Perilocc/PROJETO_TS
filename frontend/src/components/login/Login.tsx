"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Car, Loader2 } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginFormData } from "@/schemas/authSchema";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError(null);
            const result = await signIn("credentials", {
                email: data.email,
                senha: data.senha,
                redirect: false,
            });

            if (result?.error) {
                setError("Email ou senha incorretos");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("Erro inesperado ao fazer login");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-linear-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950">
            <ThemeToggle />
            
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]"></div>
                
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md mx-4">
                <Card className="overflow-hidden">
                    <div className="px-8 pt-8 pb-6 bg-linear-to-br from-purple-600 via-indigo-600 to-purple-700 dark:from-purple-900 dark:via-indigo-900 dark:to-purple-950">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <Car className="w-9 h-9 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center text-white mb-1">
                            Bem-vindo de volta
                        </CardTitle>
                        <CardDescription className="text-center text-purple-100 dark:text-purple-200">
                            Faça login para acessar sua conta
                        </CardDescription>
                    </div>

                    <CardContent className="px-8 py-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        className="pl-10"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        {...register("senha")}
                                        className="pl-10 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.senha && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.senha.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end">
                                <a 
                                    href="#" 
                                    className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                                >
                                    Esqueceu a senha?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Entrando...
                                    </>
                                ) : (
                                    "Entrar"
                                )}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                                        Ou
                                    </span>
                                </div>
                            </div>

                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Não tem uma conta?{" "}
                                <a 
                                    href="/registrar" 
                                    className="font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                                >
                                    Criar conta
                                </a>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
