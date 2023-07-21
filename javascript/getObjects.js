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

getBuckets();
