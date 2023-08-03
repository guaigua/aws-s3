import { S3Client, CopyObjectCommand } from "@aws-sdk/client-s3";
import { retryMiddleware } from "@aws-sdk/middleware-retry";

const customRetryStrategy = (maxAttempts) => (error, attempt) => {
    if (attempt < maxAttempts && error.statusCode === 503) {
      return 1000 * Math.pow(2, attempt);
    }
    return null; // No more retries
  };

async function transferObjectBetweenBuckets() {
  const SOURCE_REGION = "br01";
  const SOURCE_ENDPOINT = "https://br01-obst.uni.cloud:443";
  const SOURCE_ACCESS_KEY_ID = "069f35c5752641a99d10d56159ad59c0";
  const SOURCE_SECRET_ACCESS_KEY = "a84587d04fd448978d88ad8fcc163f95";
  const SOURCE_BUCKET_NAME = "testunicloud";

  const DESTINATION_REGION = "br02";
  const DESTINATION_ENDPOINT = "https://br02-obstveeam01.uni.cloud:443";
  const DESTINATION_ACCESS_KEY_ID = "a526f0f32ed240e1a4c09df04b0d5eaa";
  const DESTINATION_SECRET_ACCESS_KEY = "ddc13cf862594fcba1da9293b742cda1";
  const DESTINATION_BUCKET_NAME = "testunicloud";

  async function jitteredExponentialBackoff(retryAttempt) {
    const baseDelay = 1000; // 1 second
    const maxDelay = 16000; // 16 seconds
  
    const exponentialBackoff = Math.min(Math.pow(2, retryAttempt) * baseDelay, maxDelay);
    const jitter = Math.random() * baseDelay;
    const delay = exponentialBackoff + jitter;
  
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  // Create an S3 client for the source and destination buckets
  const sourceS3Client = new S3Client({
    region: SOURCE_REGION,
    endpoint: SOURCE_ENDPOINT,
    forcePathStyle: true, 
    credentials: {
      accessKeyId: SOURCE_ACCESS_KEY_ID,
      secretAccessKey: SOURCE_SECRET_ACCESS_KEY,
    },
  });

  const destinationS3Client = new S3Client({
    region: DESTINATION_REGION,
    endpoint: DESTINATION_ENDPOINT,
    forcePathStyle: true, 
    credentials: {
      accessKeyId: DESTINATION_ACCESS_KEY_ID,
      secretAccessKey: DESTINATION_SECRET_ACCESS_KEY,
    },
  });

  // The key of the object you want to copy
  const objectKey = "README3.md";

  // Set up the parameters for the copy command
  const copyParams = {
    Bucket: DESTINATION_BUCKET_NAME,
    CopySource: `/${SOURCE_BUCKET_NAME}/${objectKey}`,
    Key: objectKey,
  };

  const maxAttempts = 5;
  let attempt = 1;
  let lastError;


  while (attempt <= maxAttempts) {
    try {
      // Perform the copy operation
      const data = await destinationS3Client.send(new CopyObjectCommand(copyParams));
      console.log("Object copied successfully:", data);
      return; // Exit the function if successful
    } catch (err) {
      console.error("Error copying object:", err);
      lastError = err;
      if (err.statusCode === 503) {
        // Retry with exponential backoff and jitter
        await jitteredExponentialBackoff(attempt);
        attempt++;
      } else {
        // For non-503 errors, do not retry
        attempt = maxAttempts + 1;
      }
    }
  }

  // If all attempts failed, log the last error
  console.error("All retry attempts failed. Last error:", lastError);
}

// Call the function to initiate the transfer
transferObjectBetweenBuckets();