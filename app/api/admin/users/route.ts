import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";

        const skip = (page - 1) * limit;

        // Construir filtros
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        // Buscar usuários com contagem total
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            }),
            prisma.user.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            users,
            total,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, email, password, role } = await request.json();

        // Verificar se o email já existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email já está em uso" }, { status: 400 });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
    }
}
