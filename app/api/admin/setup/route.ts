import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

// Instanciando o Prisma diretamente para evitar problemas de importação
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    console.log("Setup API: Iniciando processamento");
    
    // Obter os dados da requisição
    const body = await req.json();
    const { name, email, password, secretKey } = body;
    
    console.log("Dados recebidos:", { name, email, hasPassword: !!password, secretKeyLength: secretKey?.length });
    
    // Verificar se todos os campos estão presentes
    if (!name || !email || !password || !secretKey) {
      return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
    }
    
    // Verificar a chave secreta
    const adminKey = process.env.ADMIN_SECRET_KEY;
    console.log("Chave esperada:", adminKey);
    console.log("Chave recebida:", secretKey);
    
    if (secretKey !== adminKey) {
      return NextResponse.json({ message: "Chave secreta inválida" }, { status: 401 });
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar o administrador
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    
    console.log("Administrador criado:", admin.id);
    
    // Retornar resposta
    return NextResponse.json({
      message: "Administrador criado com sucesso",
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error: any) {
    console.error("Erro ao criar administrador:", error);
    
    return NextResponse.json({
      message: "Erro ao criar administrador",
      error: error.message
    }, { status: 500 });
  } finally {
    // Desconectar o Prisma
    await prisma.$disconnect();
  }
}
