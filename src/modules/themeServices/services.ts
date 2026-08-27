// src/modules/themeServices/services.ts
import { JokeType } from "@prisma/client";
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

  async getThemeJokes({
    themeId,
    type,
    page,
    limit,
  }: {
    themeId: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const theme = await this.repository.getThemeById(themeId);

    if (!theme) {
      throw new AppError("Theme not found", 404);
    }

    // Validate type if provided
    let jokeType: JokeType | undefined;

    if (type) {
      if (!Object.values(JokeType).includes(type as JokeType)) {
        throw new AppError(
          "Invalid joke type. Use FAMILY_FRIENDLY or ADULT",
          400,
        );
      }

      jokeType = type as JokeType;
    }

    const result = await this.repository.getThemeJokes({
      themeId,
      type: jokeType,
      page,
      limit,
    });

    return {
      message: "Theme jokes fetched successfully",

      data: {
        theme: {
          theme_id: theme.theme_id,
          name: theme.name,
          thumbnail: theme.thumbnail,
        },

        jokes: result.jokes,

        pagination: result.pagination,
      },
    };
  }
}
