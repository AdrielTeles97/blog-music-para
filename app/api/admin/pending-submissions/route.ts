import { NextResponse } from "next/server";
import { getPendingSubmissions } from "@/lib/services/music-service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        // Verificar autenticação e permissão de administrador
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        // Buscar submissões pendentes
        const submissions = await getPendingSubmissions();

        return NextResponse.json(submissions);
    } catch (error) {
        console.error("Erro ao buscar submissões pendentes:", error);
        return NextResponse.json({ message: "Erro ao buscar submissões pendentes" }, { status: 500 });
    }
}
