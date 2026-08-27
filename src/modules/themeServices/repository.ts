// src/modules/themeServices/repository.ts
import { JokeType } from "@prisma/client";
import { getPagination } from "../../common/utils";
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

  async getThemeJokes({
    themeId,
    type,
    page,
    limit,
  }: {
    themeId: string;
    type?: JokeType;
    page?: number;
    limit?: number;
  }) {
    const pagination = getPagination({
      page,
      limit,
    });

    const where = {
      theme_id: themeId,

      ...(type && {
        jokeType: type,
      }),
    };

    const [jokes, total] = await prisma.$transaction([
      prisma.themeJoke.findMany({
        where,
        select: {
          joke_id: true,
          theme_id: true,
          joke: true,
          jokeType: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        skip: pagination.skip,
        take: pagination.take,
      }),

      prisma.themeJoke.count({
        where,
      }),
    ]);

    return {
      jokes,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNextPage: pagination.page < Math.ceil(total / pagination.limit),
        hasPreviousPage: pagination.page > 1,
      },
    };
  }
}
