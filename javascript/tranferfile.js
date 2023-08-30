import { S3Client, CopyObjectCommand, ListObjectsV2Command, HeadObjectCommand } from "@aws-sdk/client-s3" ;

const REGION = "br01";
const ENDPOINT = "https://br01-obst.uni.cloud:443"; 
const ACCESS_KEY_ID = "069f35c5752641a99d10d56159ad59c0";
const SECRET_ACCESS_KEY = "a84587d04fd448978d88ad8fcc163f95";
const SOURCE_BUCKET_NAME = "testunicloud";
const DESTINATION_BUCKET_NAME = "otros3bucket";

// Configura las credenciales de AWS
const credentials = {
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
};

// Función para transferir un objeto desde el bucket de origen al bucket de destino
async function transferObjectBetweenBuckets(sourceBucket, destinationBucket, objectKey) {
  const s3Client = new S3Client({ credentials, forcePathStyle: true, region: REGION, endpoint: ENDPOINT });

  // Verificar si el objeto ya existe en el bucket de destino
  try {
    const headObjectParams = {
      Bucket: destinationBucket,
      Key: objectKey,
    };
    await s3Client.send(new HeadObjectCommand(headObjectParams));
    console.log(`El objeto "${objectKey}" ya existe en el bucket "${destinationBucket}". Omitiendo la copia.`);
    return;
  } catch (err) {
    // El objeto no existe en el bucket de destino, proceder con la copia
    if (err.name !== "NotFound") {
      console.error(`Error al verificar objeto "${objectKey}" en el bucket "${destinationBucket}": `, err);
      throw err;
    }
  }

  const copyObjectParams = {
    Bucket: destinationBucket,
    CopySource: `/${sourceBucket}/${objectKey}`, // La ruta del objeto en el bucket de origen
    Key: objectKey, // El nombre del objeto en el bucket de destino (mismo nombre que en el origen)
  };

  try {
    await s3Client.send(new CopyObjectCommand(copyObjectParams));
    console.log(`Objeto "${objectKey}" transferido de "${sourceBucket}" a "${destinationBucket}".`);
  } catch (err) {
    console.error(`Error al transferir objeto "${objectKey}" de "${sourceBucket}" a "${destinationBucket}": `, err);
    throw err;
  }
}

// Función para transferir todos los objetos entre buckets
async function transferObjectsBetweenBuckets() {
  const s3Client = new S3Client({ credentials, forcePathStyle: true, region: REGION, endpoint: ENDPOINT });

  try {
    const listObjectsParams = {
      Bucket: SOURCE_BUCKET_NAME,
    };
    const data = await s3Client.send(new ListObjectsV2Command(listObjectsParams));

    for (const object of data.Contents) {
      await transferObjectBetweenBuckets(SOURCE_BUCKET_NAME, DESTINATION_BUCKET_NAME, object.Key);
    }
  } catch (err) {
    console.error("Error al listar objetos o transferir entre buckets: ", err);
    throw err;
  }
}

// Ejecutar la transferencia de objetos entre buckets
transferObjectsBetweenBuckets().catch((err) => console.error("Error general: ", err));
