# Script de inicialização para o projeto Music Blog
# Este script verifica e configura o ambiente necessário

# Função para exibir mensagens coloridas
function Write-ColoredOutput {
    param (
        [string]$color,
        [string]$message
    )
    
    if ($color -eq "green") {
        Write-Host $message -ForegroundColor Green
    }
    elseif ($color -eq "red") {
        Write-Host $message -ForegroundColor Red
    }
    elseif ($color -eq "yellow") {
        Write-Host $message -ForegroundColor Yellow
    }
    else {
        Write-Host $message
    }
}

Write-ColoredOutput "green" "======= Inicializando Music Blog ======="

# Verificar se o arquivo .env existe
if (-not (Test-Path .env)) {
    Write-ColoredOutput "yellow" "Arquivo .env não encontrado. Vamos criar um a partir do exemplo..."
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
        Write-ColoredOutput "green" "Arquivo .env criado! Você precisa editar e preencher os valores corretos."
    }
    else {
        Write-ColoredOutput "red" "Arquivo .env.example não encontrado. Crie um arquivo .env manualmente."
        exit 1
    }
}

# Instalar dependências
Write-ColoredOutput "yellow" "Instalando dependências..."
npm install

# Gerar o cliente Prisma
Write-ColoredOutput "yellow" "Gerando o cliente Prisma..."
npx prisma generate

# Verificar conexão com o banco
Write-ColoredOutput "yellow" "Verificando conexão com o banco de dados..."
npx prisma db push

# Iniciar o servidor
Write-ColoredOutput "green" "Tudo configurado! Iniciando o servidor..."
Write-ColoredOutput "yellow" "Para criar o primeiro administrador, acesse: http://localhost:3000/setup-admin"
npm run dev
