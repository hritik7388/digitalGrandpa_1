// src/modules/userServices/service.ts
import { UserRepository } from "./repository";
import { AppError, HttpStatus } from "../../common/errors";
import { UpdateUserInput } from "./validator";

export class UserServices {
  private readonly repository: UserRepository;
  constructor() {
    this.repository = new UserRepository();
  }

  async getUserProfile(credId: string) {
    const userProfile = await this.repository.getUserProfile(credId);
    if (!userProfile) {
      throw new AppError("User profile not found", HttpStatus.NOT_FOUND);
    }
    return {
      message: "User profile fetched successfully",
      data: userProfile,
    };
  }
  async changeProfile(credId: string, imageUrl: string) {
    const userCred = await this.repository.findUserCredId(credId);
    if (!userCred) {
      throw new AppError("User profile not found", HttpStatus.NOT_FOUND);
    }
    const userProfile = await this.repository.checkActiveUser(userCred.cred_id);
    if (!userProfile) {
      throw new AppError(
        "User profile Deleted Unverified or not Active",
        HttpStatus.NOT_FOUND,
      );
    }
    await this.repository.updateProfileImage(userProfile.user_id, imageUrl);

    return {
      message: "Profile image updated successfully",
    };
  }
  async updateProfile(credId: string, data: UpdateUserInput) {
    const user = await this.repository.findUserCredId(credId);

    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }

    const profile = await this.repository.checkActiveUser(credId);

    if (!profile) {
      throw new AppError("User profile not found", HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this.repository.updateUserProfile(
      profile.user_id,

      data,
    );

    return {
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    };
  }
  async getAvtar(credId: string) {
    const userCred = await this.repository.findUserCredId(credId);
    if (!userCred) {
      throw new AppError("User profile not found", HttpStatus.NOT_FOUND);
    }
    const userProfile = await this.repository.checkActiveUser(userCred.cred_id);
    if (!userProfile) {
      throw new AppError(
        "User profile Deleted Unverified or not Active",
        HttpStatus.NOT_FOUND,
      );
    }
    const useravtar = await this.repository.getAvtar(userProfile.user_id);
    return {
      message: "Profile get successfully ",
      data: useravtar,
    };
  }
 
}
