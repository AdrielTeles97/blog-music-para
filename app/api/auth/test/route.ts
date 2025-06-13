import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function GET() {
  try {
    // Tenta obter a sessão atual
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      message: "Teste de autenticação",
      authenticated: !!session,
      session: session || null,
    });
  } catch (error: any) {
    console.error("Erro na API de teste de autenticação:", error);
    
    return NextResponse.json({
      message: "Erro no teste de autenticação",
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
