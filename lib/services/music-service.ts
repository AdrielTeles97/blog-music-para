import { prisma } from "@/lib/db/prisma";
import { MusicSubmission } from "@/lib/types";

// Função para listar as músicas aprovadas
export async function getApprovedMusic(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const [music, total] = await Promise.all([
    prisma.music.findMany({
      where: {
        status: "APPROVED"
      },
      orderBy: {
        postedAt: "desc"
      },
      skip,
      take: limit
    }),
    prisma.music.count({
      where: {
        status: "APPROVED"
      }
    })
  ]);

  return {
    music,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

// Função para obter uma música pelo ID
export async function getMusicById(id: string) {
  return prisma.music.findUnique({
    where: { id }
  });
}

// Função para obter as músicas mais baixadas
export async function getTopDownloads(limit = 10) {
  return prisma.music.findMany({
    where: {
      status: "APPROVED"
    },
    orderBy: {
      downloads: "desc"
    },
    take: limit
  });
}

// Função para músicas adicionadas recentemente
export async function getRecentlyAdded(limit = 5) {
  return prisma.music.findMany({
    where: {
      status: "APPROVED"
    },
    orderBy: {
      postedAt: "desc"
    },
    take: limit
  });
}

// Função para registrar um download
export async function incrementDownload(id: string) {
  return prisma.music.update({
    where: { id },
    data: {
      downloads: {
        increment: 1
      }
    }
  });
}

// Função para submeter uma música
export async function submitMusic(submission: MusicSubmission) {
  const now = new Date();
  
  return prisma.music.create({
    data: {
      title: submission.title,
      artist: submission.artist,
      artistId: submission.artist.toLowerCase().replace(/\s+/g, "-"),
      album: submission.album || "",
      genre: submission.genre,
      releaseDate: submission.releaseDate || now.toISOString(),
      audioUrl: submission.audioUrl,
      coverUrl: submission.coverUrl || "/placeholder.svg",
      description: submission.description,
      submittedBy: submission.submitterName,
      postedBy: submission.submitterName,
      downloads: 0,
      spotifyUrl: submission.spotifyUrl || "",
      youtubeUrl: submission.youtubeUrl || "",
      appleMusicUrl: submission.appleMusicUrl || "",
      status: "PENDING"
    }
  });
}

// Função para listar submissões pendentes
export async function getPendingSubmissions() {
  return prisma.music.findMany({
    where: {
      status: "PENDING"
    },
    orderBy: {
      submittedAt: "desc"
    }
  });
}

// Função para aprovar uma submissão
export async function approveSubmission(id: string, reviewedBy: string) {
  const now = new Date();
  
  return prisma.music.update({
    where: { id },
    data: {
      status: "APPROVED",
      reviewedBy,
      reviewedAt: now
    }
  });
}

// Função para rejeitar uma submissão
export async function rejectSubmission(id: string, reviewedBy: string, reason: string) {
  const now = new Date();
  
  return prisma.music.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewedBy,
      reviewedAt: now,
      rejectionReason: reason
    }
  });
}
