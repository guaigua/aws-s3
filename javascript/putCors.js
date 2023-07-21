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