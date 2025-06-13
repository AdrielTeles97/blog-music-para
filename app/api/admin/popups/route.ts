import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";

// GET - Listar todos os popups
export async function GET() {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }
    
    // Buscar popups
    const popups = await prisma.popup.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(popups);
  } catch (error: any) {
    console.error("Erro ao buscar popups:", error);
    return NextResponse.json(
      { message: "Erro ao buscar popups", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Criar um novo popup
export async function POST(req: Request) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }
    
    const data = await req.json();
    
    // Adicionar campos automáticos
    data.createdBy = session.user.email;
    
    // Criar popup
    const popup = await prisma.popup.create({
      data
    });
    
    return NextResponse.json({
      message: "Popup criado com sucesso",
      popup
    });
  } catch (error: any) {
    console.error("Erro ao criar popup:", error);
    return NextResponse.json(
      { message: "Erro ao criar popup", error: error.message },
      { status: 500 }
    );
  }
}
