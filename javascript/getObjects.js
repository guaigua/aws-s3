import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";


const REGION = "br02";
const ENDPOINT = "https://br02-obstveeam01.uni.cloud:443"; 
const ACCESS_KEY_ID = "a526f0f32ed240e1a4c09df04b0d5eaa";
const SECRET_ACCESS_KEY = "ddc13cf862594fcba1da9293b742cda1";

const client = new S3Client({ 
    region: REGION,
    endpoint: ENDPOINT,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    }
});

export const main = async () => {
    const command = new ListBucketsCommand({});
    try {
        const { Owner, Buckets } = await client.send(command);
        console.log(
        `${Owner.DisplayName} owns ${Buckets.length} bucket${
            Buckets.length === 1 ? "" : "s"
        }:`
        );
        console.log(`${Buckets.map((b) => ` • ${b.Name}`).join("\n")}`);
    } catch (err) {
        console.error(err);
    }
};

main();
