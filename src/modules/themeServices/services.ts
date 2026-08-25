// src/modules/themeServices/services.ts
import { AppError } from "../../common/errors";
import { ThemeRepository } from "./repository";

// src/modules/themeServices/services.ts
export class ThemeServices {
  private readonly repository: ThemeRepository;
  constructor() {
    this.repository = new ThemeRepository();
  }

  async getAllThemes() {
    const themes = await this.repository.getAllThemes();
    return {
      message: "Themes fetched successfully",
      data: themes,
    };
  } 
  async getThemeById(themeId: string) {
    const theme = await this.repository.getThemeById(themeId);
    if (!theme) {
      console.log("❌ Theme not found:", themeId);

      throw new AppError("Theme not found", 404);
    }
    const response = {
      message: "Theme fetched successfully",
      data: theme,
    };
    return response;
  }
}
