// src/modules/personalizeServices/repository.ts

import prisma from "../../config/prisma";
import { CreatePersonalizationInput } from "./validator";

export class PersonalizationRepository {
  async findPersonalizationByProductId(productId: string) {
    return prisma.personalization.findFirst({
      where: {
        product_id: productId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createPersonalization(data: CreatePersonalizationInput) {
    return prisma.personalization.create({
      data: {
        product_id: data.product_id,
        theme_id: data.theme_id,
        forWhom: data.forWhom,
        order_id: data.order_id,
      },
    });
  }

  async findOrderById(orderId: string) {
    return prisma.order.findUnique({
      where: {
        order_id: orderId,
      },
    });
  }

  async findThemeById(themeId: string) {
    return prisma.theme.findUnique({
      where: {
        theme_id: themeId,
      },
    });
  }

  async updateUploadedImageByProductId(
    productId: string,
    uploadedImage: string,
  ) {
    const personalization = await prisma.personalization.findFirst({
      where: {
        product_id: productId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!personalization) {
      return null;
    }

    return prisma.personalization.update({
      where: {
        personalization_id: personalization.personalization_id,
      },
      data: {
        uploadedImage,
      },
    });
  }

  async saveSelectedJokes(
    personalizationId: string,
    productId: string,
    jokeIds: string[],
  ) {
    return prisma.$transaction(async (tx) => {
      // Remove old selected jokes
      await tx.personalizationJoke.deleteMany({
        where: {
          personalization_id: personalizationId,
        },
      });

      // Save current selected jokes
      const result = await tx.personalizationJoke.createMany({
        data: jokeIds.map((jokeId) => ({
          personalization_id: personalizationId,
          product_id: productId,
          joke_id: jokeId,
        })),
      });

      return result;
    });
  }

  async findJokesByIdsAndTheme(jokeIds: string[], themeId: string) {
    return prisma.themeJoke.findMany({
      where: {
        joke_id: {
          in: jokeIds,
        },
        theme_id: themeId,
      },
      select: {
        joke_id: true,
        joke: true,
        jokeType: true,
      },
    });
  }
}
