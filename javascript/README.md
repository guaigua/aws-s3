# aws-s3

Voce vai precisar um arquivo em libs s3Client-br01.js

import { S3Client } from "@aws-sdk/client-s3";

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

export { client };