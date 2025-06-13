import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";

// GET - Buscar um banner por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }
    
    const id = params.id;
    
    // Buscar banner
    const banner = await prisma.banner.findUnique({
      where: { id }
    });
    
    if (!banner) {
      return NextResponse.json(
        { message: "Banner não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(banner);
  } catch (error: any) {
    console.error(`Erro ao buscar banner ${params.id}:`, error);
    return NextResponse.json(
      { message: "Erro ao buscar banner", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar um banner existente
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }
    
    const id = params.id;
    const data = await req.json();
    
    // Atualizar banner
    const banner = await prisma.banner.update({
      where: { id },
      data
    });
    
    return NextResponse.json({
      message: "Banner atualizado com sucesso",
      banner
    });
  } catch (error: any) {
    console.error(`Erro ao atualizar banner ${params.id}:`, error);
    return NextResponse.json(
      { message: "Erro ao atualizar banner", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Excluir um banner
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }
    
    const id = params.id;
    
    // Excluir banner
    await prisma.banner.delete({
      where: { id }
    });
    
    return NextResponse.json({
      message: "Banner excluído com sucesso"
    });
  } catch (error: any) {
    console.error(`Erro ao excluir banner ${params.id}:`, error);
    return NextResponse.json(
      { message: "Erro ao excluir banner", error: error.message },
      { status: 500 }
    );
  }
}
