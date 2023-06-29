#!/usr/bin/env python

import boto3

session = boto3.session.Session(profile_name='zadara')

s3_client = session.client(
    service_name='s3',
    region_name='br02',
    endpoint_url='https://br02-obstveeam01.uni.cloud',
)

print('Buckets')
print(s3_client.list_buckets())

# print('')

# print('Objects')
# print(s3_client.list_objects(Bucket='test'))
# Verificar la versión de AWS Signature utilizada
if s3_client.meta.config.signature_version == 's3v4':
    print("Se está utilizando AWS Signature Version 4.")
else:
    print("Se está utilizando otra versión de AWS Signature.")
