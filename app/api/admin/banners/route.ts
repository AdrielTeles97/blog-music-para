import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";

// GET - Listar todos os banners
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

    // Buscar banners
    const banners = await prisma.banner.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(banners);
  } catch (error: any) {
    console.error("Erro ao buscar banners:", error);
    return NextResponse.json(
      { message: "Erro ao buscar banners", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Criar um novo banner
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

    // Obter dados do banner
    const data = await req.json();
    
    // Validar dados
    if (!data.title || !data.imageUrl) {
      return NextResponse.json(
        { message: "Título e URL da imagem são obrigatórios" },
        { status: 400 }
      );
    }

    // Contar banners para determinar a ordem
    const bannerCount = await prisma.banner.count();

    // Criar banner
    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        description: data.description || "",
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl || "",
        isActive: data.isActive !== undefined ? data.isActive : true,
        order: data.order !== undefined ? data.order : bannerCount + 1,
      },
    });

    return NextResponse.json({
      message: "Banner criado com sucesso",
      banner,
    });
  } catch (error: any) {
    console.error("Erro ao criar banner:", error);
    return NextResponse.json(
      { message: "Erro ao criar banner", error: error.message },
      { status: 500 }
    );
  }
}
