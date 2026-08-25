// src/modules/userServices/controller.ts
import { ApiResponse, catchAsync } from "../../common/utils";
import { UserServices } from "./service";
import { UpdateUserInput } from "./validator";
import { Request, Response } from "express";
// src/modules/userServices/controller.ts
export class UserController {
  private readonly userService: UserServices;

  constructor() {
    this.userService = new UserServices();
  }
  getUserProfile = catchAsync(async (req, res) => {
    const credId = req.user?.credId;

    const result = await this.userService.getUserProfile(credId!);

    ApiResponse.success(res, 200, result.message, result.data);
  });
  changeProfile = catchAsync(async (req, res) => {
    const credId = req.user?.credId;
    const result = await this.userService.changeProfile(
      credId!,
      req.body.imageUrl,
    );
    ApiResponse.success(res, 200, result.message);
  });
  updateUser = catchAsync(
    async (
      req: Request<{}, {}, UpdateUserInput>,
      res: Response,
    ): Promise<void> => {
      const credId = req.user?.credId;
      const result = await this.userService.updateProfile(credId!, req.body);
      ApiResponse.success(res, 200, result.message, result.data);
    },
  );

  getAvtar = catchAsync(async (req, res) => {
    const credId = req.user?.credId;
    const result = await this.userService.getAvtar(credId!);
    ApiResponse.success(res, 200, result.message, result.data);
  });

 
}
