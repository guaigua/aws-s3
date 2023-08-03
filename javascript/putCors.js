<<<<<<< HEAD
import { PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";


import { client } from "./libs/s3Client-br02.js";

async function setBucketCors(bucketName, corsConfigurationFile) {
  try {
    // Read the CORS configuration from the file
    const corsConfiguration = JSON.parse(await readFile(corsConfigurationFile, "utf8"));

    // Prepare and send the PutBucketCorsCommand
    const params = {
      Bucket: bucketName,
      CORSConfiguration: corsConfiguration
    };
    const command = new PutBucketCorsCommand(params);
    await client.send(command);

    console.log("CORS Configuration has been set successfully!");
  } catch (error) {
    console.error("Error setting CORS configuration:", error);
  }
}

// Call the function with the bucket name and the path to the CORS configuration file
setBucketCors("testunicloud", "/Users/germanguaigua/Apps/aws-s3/javascript/cors.json");
=======
import { PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";

const REGION = "br01";
const ENDPOINT = "https://br01-obst.uni.cloud:443"; 
const ACCESS_KEY_ID = "069f35c5752641a99d10d56159ad59c0";
const SECRET_ACCESS_KEY = "a84587d04fd448978d88ad8fcc163f95";

const client = new S3Client({ 
    region: REGION,
    endpoint: ENDPOINT,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    }
});

// By default, Amazon S3 doesn't allow cross-origin requests. Use this command
// to explicitly allow cross-origin requests.
export const main = async () => {
  const command = new PutBucketCorsCommand({
    Bucket: "testunicloud",
    CORSConfiguration: {
      CORSRules: [
        {
          // Allow all headers to be sent to this bucket.
          AllowedHeaders: ["*"],
          // Allow only GET and PUT methods to be sent to this bucket.
          AllowedMethods: ["GET"],
          // Allow only requests from the specified origin.
          AllowedOrigins: ["*"],
          // Allow the entity tag (ETag) header to be returned in the response. The ETag header
          // The entity tag represents a specific version of the object. The ETag reflects
          // changes only to the contents of an object, not its metadata.
          ExposeHeaders: ["ETag"],
          // How long the requesting browser should cache the preflight response. After
          // this time, the preflight request will have to be made again.
          MaxAgeSeconds: 3600,
        },
      ],
    },
  });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

>>>>>>> 71b253c (Feat :sparkles: add files)
