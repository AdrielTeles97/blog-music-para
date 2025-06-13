# Script de inicialização para o projeto Music Blog
# Este script verifica e configura o ambiente necessário

# Função para exibir mensagens coloridas
function print_colored() {
    local color=$1
    local message=$2
    
    if [ "$color" = "green" ]; then
        echo -e "\033[0;32m$message\033[0m"
    elif [ "$color" = "red" ]; then
        echo -e "\033[0;31m$message\033[0m"
    elif [ "$color" = "yellow" ]; then
        echo -e "\033[0;33m$message\033[0m"
    else
        echo "$message"
    fi
}

print_colored "green" "======= Inicializando Music Blog ======="

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    print_colored "yellow" "Arquivo .env não encontrado. Vamos criar um a partir do exemplo..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_colored "green" "Arquivo .env criado! Você precisa editar e preencher os valores corretos."
    else
        print_colored "red" "Arquivo .env.example não encontrado. Crie um arquivo .env manualmente."
        exit 1
    fi
fi

# Instalar dependências
print_colored "yellow" "Instalando dependências..."
npm install

# Gerar o cliente Prisma
print_colored "yellow" "Gerando o cliente Prisma..."
npx prisma generate

# Verificar conexão com o banco
print_colored "yellow" "Verificando conexão com o banco de dados..."
npx prisma db push

# Iniciar o servidor
print_colored "green" "Tudo configurado! Iniciando o servidor..."
print_colored "yellow" "Para criar o primeiro administrador, acesse: http://localhost:3000/setup-admin"
npm run dev
