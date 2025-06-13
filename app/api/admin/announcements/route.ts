import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";

// GET - Listar todos os anúncios
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
    
    // Buscar anúncios
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(announcements);
  } catch (error: any) {
    console.error("Erro ao buscar anúncios:", error);
    return NextResponse.json(
      { message: "Erro ao buscar anúncios", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Criar um novo anúncio
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
    
    // Criar anúncio
    const announcement = await prisma.announcement.create({
      data
    });
    
    return NextResponse.json({
      message: "Anúncio criado com sucesso",
      announcement
    });
  } catch (error: any) {
    console.error("Erro ao criar anúncio:", error);
    return NextResponse.json(
      { message: "Erro ao criar anúncio", error: error.message },
      { status: 500 }
    );
  }
}
