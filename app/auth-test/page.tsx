"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/test");
      const data = await response.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-6 md:py-10">
      <PageHeader
        title="Teste de Autenticação"
        description="Página para testar a funcionalidade de autenticação"
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Status da Sessão</h2>
          <div className="space-y-2">
            <p>
              <strong>Status:</strong> {status}
            </p>
            {session && (
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}

            {status === "authenticated" ? (
              <Button onClick={handleLogout}>Sair</Button>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                {error && (
                  <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Senha</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Processando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">API de Autenticação</h2>
          
          <Button 
            onClick={testAuth} 
            disabled={loading}
            className="mb-4"
          >
            Testar API de Autenticação
          </Button>
          
          {testResult && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Resultado do Teste:</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-80">
                <pre className="text-xs">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
