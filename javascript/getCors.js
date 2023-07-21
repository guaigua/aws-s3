import { client } from "./libs/s3Client-br01.js";

// Set the parameters
const params = {
  Bucket: "testunicloud", // The name of the bucket. For example, 'sample-bucket-101'.
  Key: "README.md", // The name of the object. For example, 'sample_upload.txt'.
  Body: "Hello world", // The content of the object. For example, 'Hello world!".
};

async function getBucketCors(bucketName) {
  try {
    const corsConfiguration = await client.send(
      new GetBucketCorsCommand({ Bucket: params.Bucket})
    );

    console.log("CORS Configuration:");
    console.log(corsConfiguration.CORSRules);
  } catch (error) {
    console.error("Error fetching CORS configuration:", error);
  }
}

export { getBucketCors };
