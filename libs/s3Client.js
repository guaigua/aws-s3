import { S3Client } from "@aws-sdk/client-s3";

const REGION = "br02";
const ENDPOINT = "https://br02-obstveeam01.uni.cloud:443";
const ACCESS_KEY_ID = "a526f0f32ed240e1a4c09df04b0d5eaa";
const SECRET_ACCESS_KEY = "ddc13cf862594fcba1da9293b742cda1";

const s3Client = new S3Client({ 
    region: REGION,
    endpoint: ENDPOINT,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    }
});

export { s3Client };
