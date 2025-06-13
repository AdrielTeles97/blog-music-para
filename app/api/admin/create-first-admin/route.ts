import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db/prisma";

// Chave secreta definida no ambiente (para produção, use variáveis de ambiente)
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "chave-secreta-admin-inicializacao";

export async function POST(req: Request) {
    try {
        console.log("Iniciando processamento da criação de admin");
        
        // Verificar se a requisição é JSON válido
        let body;
        try {
            body = await req.json();
        } catch (e) {
            console.error("Erro ao fazer parse do JSON da requisição:", e);
            return NextResponse.json({ message: "Formato de requisição inválido" }, { status: 400 });
        }
        
        const { name, email, password, secretKey } = body;
        
        console.log("Dados recebidos:", { name, email, secretKeyLength: secretKey?.length });
        
        // Verificar se todos os campos estão presentes
        if (!name || !email || !password || !secretKey) {
            console.error("Campos obrigatórios ausentes");
            return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
        }
        
        // Verificar a chave secreta
        console.log("Verificando chave secreta...");
        console.log("Chave recebida:", secretKey);
        console.log("Chave esperada:", ADMIN_SECRET_KEY);
        
        if (secretKey !== ADMIN_SECRET_KEY) {
            console.error("Chave secreta inválida");
            return NextResponse.json({ message: "Chave secreta inválida" }, { status: 401 });
        }        // Verificar se já existe algum administrador
        console.log("Verificando se já existe um administrador...");
        let existingAdminCount;
        try {
            existingAdminCount = await prisma.user.count({
                where: { role: "ADMIN" },
            });
            console.log("Contagem de admins existentes:", existingAdminCount);
        } catch (e) {
            console.error("Erro ao verificar administradores:", e);
            return NextResponse.json({ message: "Erro ao acessar o banco de dados" }, { status: 500 });
        }

        if (existingAdminCount > 0) {
            console.log("Já existe um administrador no sistema");
            return NextResponse.json({ message: "Já existe um administrador no sistema" }, { status: 400 });
        }        // Verificar se o email já está em uso
        console.log("Verificando se o email já está em uso...");
        let existingUser;
        try {
            existingUser = await prisma.user.findUnique({
                where: { email },
            });
            console.log("Usuário com este email:", existingUser ? "existe" : "não existe");
        } catch (e) {
            console.error("Erro ao verificar email:", e);
            return NextResponse.json({ message: "Erro ao verificar email" }, { status: 500 });
        }

        if (existingUser) {
            return NextResponse.json({ message: "Este email já está em uso" }, { status: 400 });
        }

        // Hash da senha
        console.log("Criando hash da senha...");
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (e) {
            console.error("Erro ao criar hash da senha:", e);
            return NextResponse.json({ message: "Erro ao processar senha" }, { status: 500 });
        }

        // Criar o administrador
        console.log("Criando o administrador...");
        let newAdmin;
        try {
            newAdmin = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "ADMIN",
                },
            });
            console.log("Administrador criado com sucesso:", newAdmin.id);
        } catch (e) {
            console.error("Erro ao criar administrador no banco:", e);
            return NextResponse.json({ message: "Erro ao criar administrador no banco de dados" }, { status: 500 });
        }        // Remover a senha do resultado
        const { password: _, ...adminWithoutPassword } = newAdmin;        console.log("Retornando resposta de sucesso");
        return NextResponse.json({
            message: "Administrador criado com sucesso",
            user: adminWithoutPassword,
        });
    } catch (error: any) {
        console.error("Erro ao criar administrador:", error);
        
        // Verificar se o erro é da Prisma
        if (error.name === 'PrismaClientKnownRequestError') {
            console.error("Erro Prisma:", error.code, error.message);
        }
        
        return NextResponse.json({ 
            message: "Erro ao criar administrador",
            error: error.message || "Erro desconhecido"
        }, { status: 500 });
    }
}
