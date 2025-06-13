import { prisma } from "@/lib/db/prisma";
import { Banner, Announcement, Popup } from "@/lib/types";

// Serviço para Banners
export async function getAllBanners(activeOnly = false) {
    const where = activeOnly
        ? {
              isActive: true,
              AND: [{ OR: [{ endDate: null }, { endDate: { gte: new Date() } }] }, { startDate: { lte: new Date() } }],
          }
        : {};

    return prisma.banner.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
}

export async function getBannerById(id: string) {
    return prisma.banner.findUnique({
        where: { id },
    });
}

export async function createBanner(data: Banner, userId: string) {
    return prisma.banner.create({
        data: {
            ...data,
            createdBy: userId,
        },
    });
}

export async function updateBanner(id: string, data: Partial<Banner>) {
    return prisma.banner.update({
        where: { id },
        data: {
            ...data,
            updatedAt: new Date(),
        },
    });
}

export async function deleteBanner(id: string) {
    return prisma.banner.delete({
        where: { id },
    });
}

// Serviço para Anúncios
export async function getAllAnnouncements(activeOnly = false) {
    const where = activeOnly
        ? {
              isActive: true,
              AND: [{ OR: [{ endDate: null }, { endDate: { gte: new Date() } }] }, { startDate: { lte: new Date() } }],
          }
        : {};

    return prisma.announcement.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
}

export async function getAnnouncementById(id: string) {
    return prisma.announcement.findUnique({
        where: { id },
    });
}

export async function createAnnouncement(data: Announcement, userId: string) {
    return prisma.announcement.create({
        data: {
            ...data,
            createdBy: userId,
        },
    });
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>) {
    return prisma.announcement.update({
        where: { id },
        data: {
            ...data,
            updatedAt: new Date(),
        },
    });
}

export async function deleteAnnouncement(id: string) {
    return prisma.announcement.delete({
        where: { id },
    });
}

// Serviço para Popups
export async function getAllPopups(activeOnly = false) {
    const where = activeOnly
        ? {
              isActive: true,
              AND: [{ OR: [{ endDate: null }, { endDate: { gte: new Date() } }] }, { startDate: { lte: new Date() } }],
          }
        : {};

    return prisma.popup.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
}

export async function getPopupById(id: string) {
    return prisma.popup.findUnique({
        where: { id },
    });
}

export async function createPopup(data: Popup, userId: string) {
    return prisma.popup.create({
        data: {
            ...data,
            createdBy: userId,
        },
    });
}

export async function updatePopup(id: string, data: Partial<Popup>) {
    return prisma.popup.update({
        where: { id },
        data: {
            ...data,
            updatedAt: new Date(),
        },
    });
}

export async function deletePopup(id: string) {
    return prisma.popup.delete({
        where: { id },
    });
}
