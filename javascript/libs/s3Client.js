import { S3Client } from "@aws-sdk/client-s3";

const REGION = "br02";
const ENDPOINT = "";
const ACCESS_KEY_ID = "";
const SECRET_ACCESS_KEY = "";

const s3Client = new S3Client({ 
    region: REGION,
    endpoint: ENDPOINT,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    }
});

export { s3Client };
