import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  console.log("Iniciando rota direct-setup");
  
  const prisma = new PrismaClient();
  
  try {
    console.log("Conectando ao banco de dados...");
    
    // Verificar conexão com o banco
    await prisma.$connect();
    console.log("Conectado ao banco de dados com sucesso");
    
    // Obter dados da requisição
    const body = await req.json();
    const { name, email, password, secretKey } = body;
    
    console.log("Dados recebidos:", { 
      name, 
      email, 
      hasPassword: !!password, 
      secretKeyLength: secretKey?.length 
    });
    
    // Validar dados
    if (!name || !email || !password || !secretKey) {
      console.log("Dados inválidos");
      return NextResponse.json({ 
        success: false,
        message: "Todos os campos são obrigatórios" 
      }, { status: 400 });
    }
    
    // Validar chave secreta
    const adminKey = process.env.ADMIN_SECRET_KEY;
    if (secretKey !== adminKey) {
      console.log("Chave secreta inválida");
      return NextResponse.json({ 
        success: false,
        message: "Chave secreta inválida" 
      }, { status: 401 });
    }
    
    // Hash da senha
    console.log("Gerando hash da senha...");
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Verificar se já existe algum admin
    console.log("Verificando admins existentes...");
    const adminCount = await prisma.user.count({
      where: {
        role: "ADMIN"
      }
    });
    
    if (adminCount > 0) {
      console.log("Já existe um administrador");
      return NextResponse.json({
        success: false, 
        message: "Já existe um administrador no sistema" 
      }, { status: 400 });
    }
    
    // Criar administrador
    console.log("Criando administrador...");
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN"
      }
    });
    
    console.log("Administrador criado com sucesso:", user.id);
    
    // Remover senha do resultado
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      message: "Administrador criado com sucesso",
      user: userWithoutPassword
    });
      } catch (error: any) {
    console.error("Erro na rota direct-setup:", error);
    
    return NextResponse.json({
      success: false,
      message: "Erro ao criar administrador",
      error: error.message || "Erro desconhecido"
    }, { status: 500 });
    
  } finally {
    // Desconectar do banco
    await prisma.$disconnect();
    console.log("Desconectado do banco de dados");
  }
}
