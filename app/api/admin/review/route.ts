import { NextResponse } from "next/server";
import { approveSubmission, rejectSubmission } from "@/lib/services/music-service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        // Verificar autenticação e permissão de administrador
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        const { action, id, reason } = await req.json();

        if (!id || !action || (action !== "approve" && action !== "reject")) {
            return NextResponse.json({ message: "Parâmetros inválidos" }, { status: 400 });
        }

        if (action === "approve") {
            const music = await approveSubmission(id, session.user.email || "admin");
            return NextResponse.json({
                message: "Submissão aprovada com sucesso",
                music,
            });
        } else {
            if (!reason) {
                return NextResponse.json({ message: "É necessário fornecer um motivo para rejeitar" }, { status: 400 });
            }

            await rejectSubmission(id, session.user.email || "admin", reason);
            return NextResponse.json({
                message: "Submissão rejeitada com sucesso",
            });
        }
    } catch (error) {
        console.error("Erro ao revisar submissão:", error);
        return NextResponse.json({ message: "Erro ao revisar submissão" }, { status: 500 });
    }
}
