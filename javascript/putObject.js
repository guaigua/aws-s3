// Import required AWS SDK clients and commands for Node.js.
import { PutObjectCommand, S3Client  } from "@aws-sdk/client-s3";


// Set the parameters
const params = {
  Bucket: "testunicloud", // The name of the bucket. For example, 'sample-bucket-101'.
  Key: "README.md", // The name of the object. For example, 'sample_upload.txt'.
  Body: "Hello world", // The content of the object. For example, 'Hello world!".
};

const REGION = "";
const ENDPOINT = ""; 
const ACCESS_KEY_ID = "";
const SECRET_ACCESS_KEY = "";


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
