"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function SetupAdminPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [testLoading, setTestLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        name,
        email,
        password,
        secretKey
      }

      console.log("Enviando dados:", payload)
      
      const response = await fetch("/api/admin/direct-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar administrador")
      }

      console.log("Resposta:", data)
      setSuccess(true)    } catch (err: any) {
      console.error("Erro:", err)
      if (err.name === 'SyntaxError' && err.message.includes('Unexpected token')) {
        setError("Erro na API: O servidor retornou um formato inválido. Verifique os logs.")
      } else {
        setError(err.message || "Ocorreu um erro desconhecido")
      }
    } finally {
      setLoading(false)
    }
  }

  const testDatabase = async () => {
    setTestLoading(true)
    try {
      const response = await fetch("/api/test/db")
      const data = await response.json()
      setTestResult(data)
    } catch (err) {
      console.error("Erro ao testar banco:", err)
      setTestResult({ error: "Falha ao conectar com a API" })
    } finally {
      setTestLoading(false)
    }
  }

  const testApi = async () => {
    setTestLoading(true)
    try {
      const response = await fetch("/api/test")
      const data = await response.json()
      setTestResult(data)
    } catch (err) {
      console.error("Erro ao testar API:", err)
      setTestResult({ error: "Falha ao conectar com a API" })
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <div className="container py-6 md:py-10">
      <PageHeader
        title="Configuração de Administrador"
        description="Configuração simplificada para criar o primeiro administrador"
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Criar Administrador</h2>
          
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
              Erro: {error}
            </div>
          )}

          {success ? (
            <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
              <p className="font-bold">Administrador criado com sucesso!</p>
              <p className="mt-2">Você já pode fazer login com suas credenciais.</p>
              <Button 
                className="mt-4" 
                onClick={() => window.location.href = "/login"}
              >
                Ir para o Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">Nome</label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">Senha</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="secretKey">Chave Secreta</label>
                <Input
                  id="secretKey"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use a chave definida em ADMIN_SECRET_KEY no arquivo .env
                </p>
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Processando...
                  </>
                ) : (
                  "Criar Administrador"
                )}
              </Button>
            </form>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Ferramentas de Diagnóstico</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Button onClick={testApi} disabled={testLoading} variant="outline" className="w-full">
                Testar API
              </Button>
              <Button onClick={testDatabase} disabled={testLoading} variant="outline" className="w-full">
                Testar Conexão com Banco de Dados
              </Button>
            </div>
            
            {testLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin h-6 w-6 mr-2" />
                <span>Testando...</span>
              </div>
            )}

            {testResult && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Resultado do Teste:</h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-80 text-xs">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
