// src/modules/themeServices/controller.ts
import { catchAsync ,ApiResponse} from "../../common/utils"; 
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

  getThemeJokes = catchAsync(async (req, res) => {
    const themeId = String(req.query.themeId);

    const type = req.query.type ? String(req.query.type) : undefined;

    const page = req.query.page ? Number(req.query.page) : undefined;

    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const result = await this.themeServices.getThemeJokes({
      themeId,
      type,
      page,
      limit,
    });

    ApiResponse.success(res, 200, result.message, result.data);
  });
}
