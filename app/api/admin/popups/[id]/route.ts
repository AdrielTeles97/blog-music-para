import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";

// GET - Buscar um popup por ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        // Verificar autenticação
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        const id = params.id;

        // Buscar popup
        const popup = await prisma.popup.findUnique({
            where: { id },
        });

        if (!popup) {
            return NextResponse.json({ message: "Popup não encontrado" }, { status: 404 });
        }

        return NextResponse.json(popup);
    } catch (error: any) {
        console.error(`Erro ao buscar popup ${params.id}:`, error);
        return NextResponse.json({ message: "Erro ao buscar popup", error: error.message }, { status: 500 });
    }
}

// PATCH - Atualizar um popup existente
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        // Verificar autenticação
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        const id = params.id;
        const data = await req.json();

        // Atualizar popup
        const popup = await prisma.popup.update({
            where: { id },
            data,
        });

        return NextResponse.json({
            message: "Popup atualizado com sucesso",
            popup,
        });
    } catch (error: any) {
        console.error(`Erro ao atualizar popup ${params.id}:`, error);
        return NextResponse.json({ message: "Erro ao atualizar popup", error: error.message }, { status: 500 });
    }
}

// DELETE - Excluir um popup
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        // Verificar autenticação
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        const id = params.id;

        // Excluir popup
        await prisma.popup.delete({
            where: { id },
        });

        return NextResponse.json({
            message: "Popup excluído com sucesso",
        });
    } catch (error: any) {
        console.error(`Erro ao excluir popup ${params.id}:`, error);
        return NextResponse.json({ message: "Erro ao excluir popup", error: error.message }, { status: 500 });
    }
}
