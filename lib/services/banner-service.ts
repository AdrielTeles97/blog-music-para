import { prisma } from "@/lib/db/prisma";
import { Banner } from "@prisma/client";

// Função para listar todos os banners
export async function getAllBanners() {
  return prisma.banner.findMany({
    orderBy: {
      order: "asc"
    }
  });
}

// Função para obter banners ativos
export async function getActiveBanners() {
  const now = new Date();
  
  return prisma.banner.findMany({
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
      order: "asc"
    }
  });
}

// Função para criar um novo banner
export async function createBanner(data: Omit<Banner, "id" | "createdAt" | "updatedAt">) {
  return prisma.banner.create({
    data
  });
}

// Função para atualizar um banner existente
export async function updateBanner(id: string, data: Partial<Omit<Banner, "id" | "createdAt" | "updatedAt">>) {
  return prisma.banner.update({
    where: { id },
    data
  });
}

// Função para deletar um banner
export async function deleteBanner(id: string) {
  return prisma.banner.delete({
    where: { id }
  });
}

// Função para reordenar banners
export async function reorderBanners(orderedIds: string[]) {
  // Usando transação para garantir que todas as atualizações sejam feitas
  return prisma.$transaction(
    orderedIds.map((id, index) => 
      prisma.banner.update({
        where: { id },
        data: { order: index }
      })
    )
  );
}
