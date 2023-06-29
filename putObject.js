// Import required AWS SDK clients and commands for Node.js.
import { PutObjectCommand, S3Client  } from "@aws-sdk/client-s3";


// Set the parameters
const params = {
  Bucket: "testunicloud", // The name of the bucket. For example, 'sample-bucket-101'.
  Key: "README.md", // The name of the object. For example, 'sample_upload.txt'.
  Body: "Hello world", // The content of the object. For example, 'Hello world!".
};

const REGION = "br02";
const ENDPOINT = "https://br02-obstveeam01.uni.cloud"; 
const ACCESS_KEY_ID = "a526f0f32ed240e1a4c09df04b0d5eaa";
const SECRET_ACCESS_KEY = "ddc13cf862594fcba1da9293b742cda1";


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
  // Create an object and upload it to the Amazon S3 bucket.
  try {
    const results = await client.send(new PutObjectCommand(params));
    console.log(
        "Successfully created " +
        params.Key +
        " and uploaded it to " +
        params.Bucket +
        "/" +
        params.Key
    );
    return results; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};

run();
