// src/modules/personalizeServices/service.ts
import { AppError, HttpStatus } from "../../common/errors";
import { generatePresignedUrl } from "../../common/utils/uploadImages";
import { PersonalizationRepository } from "./repository";
import { CreatePersonalizationInput, SelectPersonalizationJokesInput, UploadPersonalizationImageInput } from "./validator";

export class PersonalizationService {
  private readonly repository: PersonalizationRepository;

  constructor() {
    this.repository = new PersonalizationRepository();
  }

  async createPersonalization(data: CreatePersonalizationInput) {
    // Check order
    const order = await this.repository.findOrderById(data.order_id);

    if (!order) {
      throw new AppError(
        "Order not found",
        HttpStatus.NOT_FOUND,
      );
    }

    // Check theme
    const theme = await this.repository.findThemeById(data.theme_id);

    if (!theme) {
      throw new AppError(
        "Theme not found",
        HttpStatus.NOT_FOUND,
      );
    }

    // Create personalization
    const personalization =
      await this.repository.createPersonalization(data);

    return {
      success: true,
      message: "Personalization created successfully.",
      data: {
        personalization_id: personalization.personalization_id,
        product_id: personalization.product_id,
        theme_id: personalization.theme_id,
        forWhom: personalization.forWhom,
        order_id: personalization.order_id,
        status: personalization.status,
      },
    };
  }

 
 async uploadPersonalizationImage(
  data: UploadPersonalizationImageInput,
) {
  const personalization =
    (await this.repository.findPersonalizationByProductId(
      data.product_id,
    )) as unknown;

  if (!personalization) {
    throw new AppError(
      "Personalization not found for this product",
      HttpStatus.NOT_FOUND,
    );
  }

  const result = await generatePresignedUrl(
    data.filename,
    data.contentType,
  );

  await this.repository.updateUploadedImageByProductId(
    data.product_id,
    result.key,
  );

  return {
    success: true,
    message: "Image upload URL generated successfully.",
    data: {
      uploadUrl: result.url,
      key: result.key,
      product_id: data.product_id,
    },
  };
}

 async selectPersonalizationJokes(
    data: SelectPersonalizationJokesInput,
  ) {
    // 1. Find personalization using product_id
    const personalization =
      (await this.repository.findPersonalizationByProductId(
        data.product_id,
      )) as any;

    if (!personalization) {
      throw new AppError(
        "Personalization not found for this product",
        HttpStatus.NOT_FOUND,
      );
    }

    // 2. Get theme from personalization
    const themeId = personalization.theme_id;

    // 3. Check jokes belong to same theme
    const jokes =
      await this.repository.findJokesByIdsAndTheme(
        data.joke_ids,
        themeId,
      );

    // 4. If any joke doesn't belong to this theme
    if (jokes.length !== data.joke_ids.length) {
      throw new AppError(
        "One or more selected jokes do not belong to this theme",
        HttpStatus.BAD_REQUEST,
      );
    }

    // 5. Save selected jokes
    await this.repository.saveSelectedJokes(
      personalization.personalization_id,
      data.product_id,
      data.joke_ids,
    );

    return {
      success: true,
      message: "Jokes selected successfully.",
      data: {
        personalization_id:
          personalization.personalization_id,
        product_id: data.product_id,
        theme_id: themeId,
        selectedJokes: jokes,
        totalSelected: jokes.length,
      },
    };
  }
}

