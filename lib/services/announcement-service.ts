import { prisma } from "@/lib/db/prisma";

// Função para listar todos os anúncios
export async function getAllAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

// Função para obter anúncios ativos
export async function getActiveAnnouncements() {
  const now = new Date();
  
  return prisma.announcement.findMany({
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

// Função para criar um novo anúncio
export async function createAnnouncement(data: any) {
  return prisma.announcement.create({
    data
  });
}

// Função para atualizar um anúncio existente
export async function updateAnnouncement(id: string, data: any) {
  return prisma.announcement.update({
    where: { id },
    data
  });
}

// Função para deletar um anúncio
export async function deleteAnnouncement(id: string) {
  return prisma.announcement.delete({
    where: { id }
  });
}
