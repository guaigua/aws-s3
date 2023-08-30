import boto3
from botocore.exceptions import ClientError
import time

def transferir_archivos_entre_buckets(bucket_origen, bucket_destino, region_origen, region_destino,
                                     endpoint_origen, endpoint_destino, access_key_id_origen, secret_access_key_origen,
                                     access_key_id_destino, secret_access_key_destino):
    # Crear un cliente de Amazon S3 para el bucket de origen
    cliente_origen = boto3.client('s3', region_name=region_origen,
                                  endpoint_url=endpoint_origen,
                                  aws_access_key_id=access_key_id_origen,
                                  aws_secret_access_key=secret_access_key_origen)

    # Crear un cliente de Amazon S3 para el bucket de destino
    cliente_destino = boto3.client('s3', region_name=region_destino,
                                   endpoint_url=endpoint_destino,
                                   aws_access_key_id=access_key_id_destino,
                                   aws_secret_access_key=secret_access_key_destino)

    # Obtener la lista de objetos en el bucket de origen
    response = cliente_origen.list_objects_v2(Bucket=bucket_origen)

    if 'Contents' in response:
        # Transferir cada objeto del bucket de origen al bucket de destino
        for objeto in response['Contents']:
            clave = objeto['Key']
            delay = 1       # initial delay
            delay_incr = 1  # additional delay in each loop
            max_delay = 30  # max delay of one loop. Total delay is (max_delay**2)/2
            while delay < max_delay:
                try:
                    cliente_destino.copy_object(Bucket=bucket_destino, CopySource=f"{bucket_origen}/{clave}", Key=clave)
                    break
                except ClientError:
                    time.sleep(delay)
                    delay += delay_incr
            else:
                raise

    print("Transferencia completada.")

# Llamar a la función con la información específica de tus buckets y endpoints
# SOURCE_REGION, SOURCE_ENDPOINT, SOURCE_ACCESS_KEY_ID, SOURCE_SECRET_ACCESS_KEY, SOURCE_BUCKET_NAME, etc.
# DESTINATION_REGION, DESTINATION_ENDPOINT, DESTINATION_ACCESS_KEY_ID, DESTINATION_SECRET_ACCESS_KEY, DESTINATION_BUCKET_NAME, etc.
transferir_archivos_entre_buckets(SOURCE_BUCKET_NAME, DESTINATION_BUCKET_NAME,
                                  SOURCE_REGION, DESTINATION_REGION,
                                  SOURCE_ENDPOINT, DESTINATION_ENDPOINT,
                                  SOURCE_ACCESS_KEY_ID, SOURCE_SECRET_ACCESS_KEY,
                                  DESTINATION_ACCESS_KEY_ID, DESTINATION_SECRET_ACCESS_KEY)
