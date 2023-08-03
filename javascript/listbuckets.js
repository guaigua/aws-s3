import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { s3Client } from "./libs/s3Client.js";

export const main = async () => {
    const command = new ListBucketsCommand({});
    try {
        const { Owner, Buckets } = await s3Client.send(command);
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