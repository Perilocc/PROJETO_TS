"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Dashboard
                </h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <p className="text-gray-700 dark:text-gray-300">
                        Bem-vindo, <span className="font-semibold">{session.user.name}</span>!
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Email: {session.user.email}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Papel: {session.user.papel}
                    </p>
                </div>
            </div>
        </div>
    );
}
