// Import required AWS SDK clients and commands for Node.js.
import { PutObjectCommand, S3Client  } from "@aws-sdk/client-s3";
import fs from "fs"; 

// Set the parameters
const params = {
  Bucket: "testunicloud", // The name of the bucket. For example, 'sample-bucket-101'.
  Key: "folder/test/970AA710.dcm", // The name of the object. For example, 'sample_upload.txt'.
  Body: fs.createReadStream("970AA710.dcm"),
  ACL: "public-read", // Set the ACL to "public-read" to make the object publicly accessible.
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
  //forcePathStyle: true,
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
