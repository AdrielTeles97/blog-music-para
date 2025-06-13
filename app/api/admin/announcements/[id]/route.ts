import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";

// GET - Buscar um anúncio por ID
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
    
    // Buscar anúncio
    const announcement = await prisma.announcement.findUnique({
      where: { id }
    });
    
    if (!announcement) {
      return NextResponse.json(
        { message: "Anúncio não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(announcement);
  } catch (error: any) {
    console.error(`Erro ao buscar anúncio ${params.id}:`, error);
    return NextResponse.json(
      { message: "Erro ao buscar anúncio", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar um anúncio existente
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
    
    // Atualizar anúncio
    const announcement = await prisma.announcement.update({
      where: { id },
      data
    });
    
    return NextResponse.json({
      message: "Anúncio atualizado com sucesso",
      announcement
    });
  } catch (error: any) {
    console.error(`Erro ao atualizar anúncio ${params.id}:`, error);
    return NextResponse.json(
      { message: "Erro ao atualizar anúncio", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Excluir um anúncio
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
    
    // Excluir anúncio
    await prisma.announcement.delete({
      where: { id }
    });
    
    return NextResponse.json({
      message: "Anúncio excluído com sucesso"
    });
  } catch (error: any) {
    console.error(`Erro ao excluir anúncio ${params.id}:`, error);
    return NextResponse.json(
      { message: "Erro ao excluir anúncio", error: error.message },
      { status: 500 }
    );
  }
}
