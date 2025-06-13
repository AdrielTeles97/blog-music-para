import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
    try {
        // Tenta contar os usuários para verificar a conexão
        const userCount = await prisma.user.count();

        // Verifica as variáveis de ambiente disponíveis
        const envVars = {
            hasDbUrl: !!process.env.DATABASE_URL,
            dbUrlLength: process.env.DATABASE_URL?.length,
            hasAdminKey: !!process.env.ADMIN_SECRET_KEY,
            adminKeyLength: process.env.ADMIN_SECRET_KEY?.length,
            hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
            nextAuthSecretLength: process.env.NEXTAUTH_SECRET?.length,
        };

        return NextResponse.json({
            message: "Conexão com banco de dados funcionando",
            userCount,
            envVars,
        });
    } catch (error: any) {
        console.error("Erro ao conectar com o banco:", error);

        return NextResponse.json(
            {
                message: "Erro ao conectar com o banco de dados",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
