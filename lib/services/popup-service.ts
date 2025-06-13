import { prisma } from "@/lib/db/prisma";

// Função para listar todos os popups
export async function getAllPopups() {
  return prisma.popup.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

// Função para obter popups ativos
export async function getActivePopups() {
  const now = new Date();
  
  return prisma.popup.findMany({
    where: {
      isActive: true,
      OR: [
        {
          startDate: { lte: now },
          endDate: { gte: now }
        },
        {
          startDate: { lte: now },
          endDate: null
        }
      ]
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

// Função para criar um novo popup
export async function createPopup(data: any) {
  return prisma.popup.create({
    data
  });
}

// Função para atualizar um popup existente
export async function updatePopup(id: string, data: any) {
  return prisma.popup.update({
    where: { id },
    data
  });
}

// Função para deletar um popup
export async function deletePopup(id: string) {
  return prisma.popup.delete({
    where: { id }
  });
}
