import "server-only";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const storageBucket = getRequiredEnv("S3_BUCKET");

export const s3 = new S3Client({
  endpoint: getRequiredEnv("AWS_ENDPOINT_URL_S3"),
  region: getRequiredEnv("AWS_REGION"),
  credentials: {
    accessKeyId: getRequiredEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getRequiredEnv("AWS_SECRET_ACCESS_KEY"),
  },
  forcePathStyle: true,
});

interface UploadObjectParams {
  body: string | Uint8Array;
  contentType: string;
  key: string;
}

export async function uploadObject({
  key,
  body,
  contentType,
}: UploadObjectParams): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: storageBucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

interface DeleteObjectParams {
  key: string;
}

export async function deleteObject({ key }: DeleteObjectParams): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: storageBucket,
      Key: key,
    })
  );
}
