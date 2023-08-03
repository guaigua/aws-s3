// getBuckets.js
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { client } from "./libs/s3Client-br02.js";

async function getBuckets() {
  try {
    const data = await client.send(new ListBucketsCommand({}));
    console.log("Buckets:");
    console.log(data.Buckets);
  } catch (error) {
    console.error("Error fetching buckets:", error);
  }
}

<<<<<<< HEAD
getBuckets();
=======
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
>>>>>>> 71b253c (Feat :sparkles: add files)
