import { GetBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";

const REGION = "br01";
const ENDPOINT = "https://br01-obst.uni.cloud:443"; 
const ACCESS_KEY_ID = "069f35c5752641a99d10d56159ad59c0";
const SECRET_ACCESS_KEY = "a84587d04fd448978d88ad8fcc163f95";


const client = new S3Client({ 
    region: REGION,
    endpoint: ENDPOINT,
    forcePathStyle: true,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    }
});


export const main = async () => {
  const command = new GetBucketCorsCommand({
    Bucket: "test-bucket",
  });

  try {
    const { CORSRules } = await client.send(command);
    CORSRules.forEach((cr, i) => {
      console.log(
        `\nCORSRule ${i + 1}`,
        `\n${"-".repeat(10)}`,
        `\nAllowedHeaders: ${cr.AllowedHeaders.join(" ")}`,
        `\nAllowedMethods: ${cr.AllowedMethods.join(" ")}`,
        `\nAllowedOrigins: ${cr.AllowedOrigins.join(" ")}`,
        `\nExposeHeaders: ${cr.ExposeHeaders.join(" ")}`,
        `\nMaxAgeSeconds: ${cr.MaxAgeSeconds}`
      );
    });
  } catch (err) {
    console.error(err);
  }
};

