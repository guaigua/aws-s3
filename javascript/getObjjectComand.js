// Import required AWS SDK clients and commands for Node.js.
import { GetObjectCommand, S3Client  } from "@aws-sdk/client-s3";

// Set the parameters
const params = {
  Bucket: "testunicloud", // The name of the bucket. For example, 'sample-bucket-101'.
  Key: "images.jpg", // The name of the object. For example, 'sample_upload.txt'.
};

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

const run = async () => {
  // Get the object from the Amazon S3 bucket.
  try {
    const results = await client.send(new GetObjectCommand(params));
    const objectData = await streamToString(results.Body);
    console.log("Object Data:", objectData);
    return objectData; // Return the object data for unit tests or further processing.
  } catch (err) {
    console.log("Error", err);
  }
};

run();

// Function to convert the ReadableStream to a string.
async function streamToString(stream) {
 Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}
