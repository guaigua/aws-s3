import { S3Client, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";


const REGION = "br01";
const ENDPOINT = "https://br01-obst.uni.cloud:443"; 
const ACCESS_KEY_ID = "069f35c5752641a99d10d56159ad59c0";
const SECRET_ACCESS_KEY = "a84587d04fd448978d88ad8fcc163f95";
const BUCKET_NAME = "testunicloud";

// Configura las credenciales de AWS
const credentials = {
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
};

// Función para listar todos los objetos dentro del bucket
async function listObjects(bucketName, prefix = "") {
  const s3Client = new S3Client({ credentials, forcePathStyle: true, region: REGION, endpoint: ENDPOINT });
  const listObjectsParams = {
    Bucket: bucketName,
    Prefix: prefix,
  };

  try {
    const data = await s3Client.send(new ListObjectsCommand(listObjectsParams));
    return data.Contents;
  } catch (err) {
    console.error("Error al listar objetos: ", err);
    throw err;
  }
}

// Función para descargar un archivo desde S3
async function downloadFile(bucketName, objectKey, localFilePath) {
  const s3Client = new S3Client({ credentials, forcePathStyle: true, region: REGION, endpoint: ENDPOINT });
  const getObjectParams = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(getObjectParams));
    const fileStream = fs.createWriteStream(localFilePath);
    data.Body.pipe(fileStream);
    return new Promise((resolve, reject) => {
      fileStream.on("finish", resolve);
      fileStream.on("error", reject);
    });
  } catch (err) {
    console.error(`Error al descargar archivo "${objectKey}": `, err);
    throw err;
  }
}

// Función para descargar todos los archivos en el bucket
async function downloadAllFiles() {
  const objects = await listObjects(BUCKET_NAME);

  // Crear las carpetas locales (opcional)
  for (const object of objects) {
    const localFolderPath = path.dirname(object.Key);
    if (!fs.existsSync(localFolderPath)) {
      fs.mkdirSync(localFolderPath, { recursive: true });
    }
  }

  // Descargar los archivos
  for (const object of objects) {
    const localFilePath = path.resolve(object.Key);
    await downloadFile(BUCKET_NAME, object.Key, localFilePath);
    console.log(`Archivo "${object.Key}" descargado.`);
  }
}

// Ejecutar la descarga de todos los archivos
downloadAllFiles().catch((err) => console.error("Error general: ", err));
