import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

const allowedDocumentTypes = new Set([
  "application/pdf",
]);

const s3Client = new S3Client({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const extractS3Key = (image: string) => {
  if (!image) return null;

  // Agar complete S3 URL hai
  if (image.startsWith("http")) {
    const url = new URL(image);
    return url.pathname.substring(1);
  }

  // Already S3 key hai
  return image;
};

export const generatePresignedUrl = async (
  filename: string,
  contentType: string,
) => {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/\s+/g, "_");

  if (!allowedImageTypes.has(contentType) && !allowedDocumentTypes.has(contentType)) {
    throw new Error("Unsupported file type");
  }

  // Bucket ke andar digital-grandpa folder
  const key = `digitalgrandpa/${timestamp}-${sanitizedFilename}`;

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, putObjectCommand, {
    expiresIn: 3600,
  });

  return {
    url,
    key,
  };
};

export const generateReadUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
};