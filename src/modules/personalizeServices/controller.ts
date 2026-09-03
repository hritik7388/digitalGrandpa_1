// src/modules/personalizeServices/controller.ts
import { Request, Response } from "express";
import { catchAsync, ApiResponse } from "../../common/utils";
import { PersonalizationService } from "./service";
import { CreatePersonalizationInput, SelectPersonalizationJokesInput, UploadPersonalizationImageInput } from "./validator";

export class PersonalizationController {
  private readonly personalizationService: PersonalizationService;

  constructor() {
    this.personalizationService = new PersonalizationService();
  }

  createPersonalization = catchAsync(
    async (
      req: Request<{}, {}, CreatePersonalizationInput>,
      res: Response,
    ): Promise<void> => {
      const result =
        await this.personalizationService.createPersonalization(
          req.body,
        );

      ApiResponse.success(
        res,
        201,
        result.message,
        result.data,
      );
    },
  );
  uploadPersonalizationImage = catchAsync(
    async (
      req: Request<
        {},
        {},
        UploadPersonalizationImageInput
      >,
      res: Response,
    ): Promise<void> => {
      const result =
        await this.personalizationService.uploadPersonalizationImage(
          req.body,
        );

      ApiResponse.success(
        res,
        200,
        result.message,
        result.data,
      );
    },
  );

   selectPersonalizationJokes = catchAsync(
    async (
      req: Request<
        {},
        {},
        SelectPersonalizationJokesInput
      >,
      res: Response,
    ): Promise<void> => {

      const result =
        await this.personalizationService
          .selectPersonalizationJokes(req.body);

      ApiResponse.success(
        res,
        200,
        result.message,
        result.data,
      );
    },
  );
}