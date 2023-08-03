import { S3Client, CopyObjectCommand, ListObjectsV2Command, HeadObjectCommand } from "@aws-sdk/client-s3";

const SOURCE_REGION = "br01";
const SOURCE_ENDPOINT = "https://br01-obst.uni.cloud:443";
const SOURCE_ACCESS_KEY_ID = "069f35c5752641a99d10d56159ad59c0";
const SOURCE_SECRET_ACCESS_KEY = "a84587d04fd448978d88ad8fcc163f95";
const SOURCE_BUCKET_NAME = "testunicloud";

const DESTINATION_REGION = "br02";
const DESTINATION_ENDPOINT = "https://br02-obstveeam01.uni.cloud:443";
const DESTINATION_ACCESS_KEY_ID = "a526f0f32ed240e1a4c09df04b0d5eaa";
const DESTINATION_SECRET_ACCESS_KEY = "ddc13cf862594fcba1da9293b742cda1";
const DESTINATION_BUCKET_NAME = "testunicloud";

// Configura las credenciales de AWS para el origen
const sourceCredentials = {
  accessKeyId: SOURCE_ACCESS_KEY_ID,
  secretAccessKey: SOURCE_SECRET_ACCESS_KEY,
};

// Configura las credenciales de AWS para el destino
const destinationCredentials = {
  accessKeyId: DESTINATION_ACCESS_KEY_ID,
  secretAccessKey: DESTINATION_SECRET_ACCESS_KEY,
};

// Función para transferir un objeto desde el bucket de origen al bucket de destino
async function transferObjectBetweenBuckets(sourceS3Client, destinationS3Client, sourceBucket, destinationBucket, objectKey) {
  // Verificar si el objeto ya existe en el bucket de destino
  try {
    const headObjectParams = {
      Bucket: destinationBucket,
      Key: objectKey,
    };
    await destinationS3Client.send(new HeadObjectCommand(headObjectParams));
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
    await destinationS3Client.send(new CopyObjectCommand(copyObjectParams));
    console.log(`Objeto "${objectKey}" transferido de "${sourceBucket}" a "${destinationBucket}".`);
  } catch (err) {
    console.error(`Error al transferir objeto "${objectKey}" de "${sourceBucket}" a "${destinationBucket}": `, err);
    throw err;
  }
}

// Función para transferir objetos en lotes respetando los límites de tasa de solicitud
async function transferObjectsInBatches(sourceS3Client, destinationS3Client, sourceBucket, destinationBucket, objectKeys) {
  const requestsPerSecond = 0.1; // Cantidad máxima de solicitudes por segundo
  const batchDelay = 1000 / requestsPerSecond; // Retraso entre lotes para cumplir con el límite de solicitudes por segundo

  for (const objectKey of objectKeys) {
    await transferObjectBetweenBuckets(sourceS3Client, destinationS3Client, sourceBucket, destinationBucket, objectKey);
    await new Promise((resolve) => setTimeout(resolve, batchDelay)); // Esperar el retraso entre cada copia de objeto
  }
}

// Función para transferir todos los objetos entre buckets
async function transferObjectsBetweenBuckets() {
  const sourceS3Client = new S3Client({ credentials: sourceCredentials, forcePathStyle: true, region: SOURCE_REGION, endpoint: SOURCE_ENDPOINT });
  const destinationS3Client = new S3Client({ credentials: destinationCredentials, forcePathStyle: true, region: DESTINATION_REGION, endpoint: DESTINATION_ENDPOINT });

  try {
    const listObjectsParams = {
      Bucket: SOURCE_BUCKET_NAME,
    };
    const data = await sourceS3Client.send(new ListObjectsV2Command(listObjectsParams));

    const objectKeys = data.Contents.map((object) => object.Key);

    const batchSize = 10; // Tamaño del lote de objetos a copiar

    for (let i = 0; i < objectKeys.length; i += batchSize) {
      const batch = objectKeys.slice(i, i + batchSize);
      await transferObjectsInBatches(sourceS3Client, destinationS3Client, SOURCE_BUCKET_NAME, DESTINATION_BUCKET_NAME, batch);
    }
  } catch (err) {
    console.error("Error al listar objetos o transferir entre buckets: ", err);
    throw err;
  }
}

// Ejecutar la transferencia de objetos entre buckets
transferObjectsBetweenBuckets().catch((err) => console.error("Error general: ", err));
