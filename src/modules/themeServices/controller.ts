// src/modules/themeServices/controller.ts
import { catchAsync } from "../../common/utils";
import { ApiResponse } from "../../common/utils";
import { ThemeServices } from "./services";

// src/modules/themeServices/controller.ts
export class ThemeController {
  private readonly themeServices: ThemeServices;

  constructor() {
    this.themeServices = new ThemeServices();
  }

  getAllThemes = catchAsync(async (req, res) => {
    const result = await this.themeServices.getAllThemes();

    ApiResponse.success(res, 200, result.message, result.data);
  });

  // Controller
  getThemeById = catchAsync(async (req, res) => {
    const themeId = String(req.query.themeId);

    const result = await this.themeServices.getThemeById(themeId);

    ApiResponse.success(res, 200, result.message, result.data);
  });
}
