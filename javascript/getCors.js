<<<<<<< HEAD
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
=======
import { GetBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";
import { s3Client } from "./libs/s3Client.js";

export const main = async () => {
  const bucketName = "testunicloud";

  const command = new GetBucketCorsCommand({
      Bucket: bucketName
  });

  try {
      const { CorsRules } = await s3Client.send(command);

      if (CorsRules && CorsRules.length > 0) {
          console.log(`Configuración CORS del bucket "${bucketName}":`);
          console.log(JSON.stringify(CorsRules, null, 2));
      } else {
          console.log(`El bucket "${bucketName}" no tiene configuración CORS.`);
      }
  } catch (err) {
      console.error("Error al obtener la configuración CORS del bucket:", err);
  }
};

main();
>>>>>>> 71b253c (Feat :sparkles: add files)
