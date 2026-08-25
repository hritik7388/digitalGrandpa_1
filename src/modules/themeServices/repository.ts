// src/modules/themeServices/repository.ts
import prisma from "../../config/prisma";

export class ThemeRepository {
  async getAllThemes() {
    return prisma.theme.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        theme_id: true,
        name: true,
        thumbnail: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  // Repository
  async getThemeById(themeId: string) {
    const theme = await prisma.theme.findFirst({
      where: {
        theme_id: themeId,
        status: "ACTIVE",
      },
      select: {
        theme_id: true,
        name: true,
        thumbnail: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return theme;
  }
}
