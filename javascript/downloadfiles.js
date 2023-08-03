import { S3Client, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";


// Configura las credenciales de AWS

const REGION = "br01";
const ENDPOINT = "https://br01-obst.uni.cloud:8443"; 
const ACCESS_KEY_ID = "16ce270074144e65a8dc3e81b2c52f28";
const SECRET_ACCESS_KEY = "46b71ef97ef84fb8a18cb43279e39167";

const client = new S3Client({ 
    region: REGION,
    endpoint: ENDPOINT,
    forcePathStyle: true,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    }
});

async function downloadObjectsFromFolder(bucketName, folderName) {
  try {
    // Obtén la lista de objetos en el prefijo (carpeta)
    const listObjectsParams = {
      Bucket: bucketName,
      Prefix: folderName,
    };
    const listObjectsCommand = new ListObjectsCommand(listObjectsParams);
    const data = await client.send(listObjectsCommand);

    // Descarga cada objeto en la carpeta
    for (const object of data.Contents) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: object.Key,
      };
      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const objectData = await client.send(getObjectCommand);

      // Guarda el objeto en un archivo local (cambiar la ruta y el nombre del archivo según sea necesario)
      const fileName = object.Key.split("/").pop(); // Obtiene solo el nombre del archivo
      const filePath = `./${folderName}/${fileName}`; // Carpeta local donde se guardarán los objetos
      fs.writeFileSync(filePath, objectData.Body);
      console.log(`Descargado: ${fileName}`);
    }

    console.log("Descarga completa.");
  } catch (error) {
    console.error("Error al descargar objetos:", error);
  }
}

// Uso del método
const bucketName = "teste"; // Cambia esto por el nombre de tu bucket
const folderName = "/v1/AUTH_4020e83be07c49d894fe003c7e30a7fd/2023/06/15/672DB849/357F16F7/"; // Cambia esto por el prefijo de la carpeta (agrega una barra al final)

downloadObjectsFromFolder(bucketName, folderName);
