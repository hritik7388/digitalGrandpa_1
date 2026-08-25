// src/modules/userServices/repository.ts

import { MediaType, Prisma, UserCredentials, UserMedia, UserProfile } from "@prisma/client"; 
import prisma from "../../config/prisma";

export class UserRepository {
    async getUserProfile(credId: string): Promise<UserProfile | null> {
    return prisma.userProfile.findUnique({
      where: {
        cred_id: credId,
      },
    });
  }

    async findUserCredId(credId: string): Promise<UserCredentials | null> {
      return prisma.userCredentials.findUnique({
        where: {
          cred_id: credId,
        },
      });
    }
      async checkActiveUser(credId: string): Promise<UserProfile | null> {
        return prisma.userProfile.findUnique({
          where: {
            cred_id: credId,
            isDeleted: false,
            isVerified: true,
            status: "ACTIVE",
          },
        });
      }
     async updateProfileImage(userId: string, imageUrl: string) {
        const media = await prisma.userMedia.findFirst({
          where: {
            user_id: userId,
            mediaType: MediaType.IMAGE,
          },
        });
    
        if (media) {
          return prisma.userMedia.update({
            where: {
              media_id: media.media_id,
            },
            data: {
              url: imageUrl,
            },
          });
        }
    
        return prisma.userMedia.create({
          data: {
            user_id: userId,
            mediaType: MediaType.IMAGE,
            url: imageUrl,
          },
        });
      }
      async updateUserProfile(
    userId: string,
    data: Prisma.UserProfileUpdateInput,
  ): Promise<UserProfile> {
    return prisma.userProfile.update({
      where: {
        user_id: userId,
      },
      data,
    });
  }
    async getAvtar(userId: string): Promise<UserMedia | null> {
    return prisma.userMedia.findFirst({
      where: {
        user_id: userId,
        mediaType: MediaType.IMAGE,
      },
    });
  }
getOrderProducts = async (orderNumber: string) => { 

  const order = await prisma.order.findUnique({
    where: {
      orderNumber: orderNumber,
    },
    select: {
      order_id: true,
      orderNumber: true,

      orderItems: {
        select: {
          item_id: true,
          product_id: true,
          variant_id: true,
          title: true,
          variantTitle: true,
          image: true,
          quantity: true,
          currentQuantity: true,
          fulfillableQuantity: true,
          price: true,
          sku: true,
        },
      },
    },
  }); 

  

  return order;
};
}
