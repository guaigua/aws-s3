/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.jclouds.examples.blobstore.basics;

import static com.google.common.base.Charsets.UTF_8;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.collect.Iterables.contains;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.Properties;


import org.jclouds.ContextBuilder;
import org.jclouds.apis.ApiMetadata;
import org.jclouds.apis.Apis;
import org.jclouds.atmos.AtmosApiMetadata;
import org.jclouds.atmos.AtmosClient;
import org.jclouds.azureblob.AzureBlobApiMetadata;
import org.jclouds.azureblob.AzureBlobClient;
import org.jclouds.blobstore.BlobStore;
import org.jclouds.blobstore.BlobStoreContext;
import org.jclouds.blobstore.domain.Blob;
import org.jclouds.blobstore.domain.StorageMetadata;
import org.jclouds.domain.Credentials;
import org.jclouds.domain.Location;
import org.jclouds.googlecloudstorage.GoogleCloudStorageApi;
import org.jclouds.googlecloudstorage.GoogleCloudStorageApiMetadata;
import org.jclouds.openstack.swift.v1.SwiftApi;
import org.jclouds.openstack.swift.v1.SwiftApiMetadata;
import org.jclouds.providers.ProviderMetadata;
import org.jclouds.providers.Providers;
import org.jclouds.s3.S3ApiMetadata;
import org.jclouds.s3.S3Client;
import org.jclouds.s3.reference.S3Constants;

import com.google.common.base.Charsets;
import com.google.common.base.Supplier;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Iterables;
import com.google.common.collect.Maps;
import com.google.common.io.ByteSource;
import com.google.common.io.Files;

import org.jclouds.googlecloud.GoogleCredentialsFromJson;


/**
 * Demonstrates the use of {@link BlobStore}.
 * 
 * Usage is: java MainApp \"provider\" \"identity\" \"credential\" \"containerName\"
 */
public class MainApp {
   

   public static void main(String[] args) throws IOException {

      String provider = "";
      String identity = ""; 
      String credential = "";
      String containerName = "";
      String endpoint = "";

      // Init
      BlobStoreContext context = ContextBuilder.newBuilder(provider)
              .credentials(identity, credential)
              .endpoint(endpoint)
              .overrides(setupOverrides(provider))
              .buildView(BlobStoreContext.class);
 
      BlobStore blobStore = context.getBlobStore();

      for (StorageMetadata resourceMd : blobStore.list()) {
         if (containerName.equals(resourceMd.getName())) {
         System.out.println(resourceMd);
         }
      }
   }

   private static Properties setupOverrides(String provider) {
      Properties overrides = new Properties();
      if (provider.equalsIgnoreCase("aws-s3")) {
        String virtualHostValue = "false";
        overrides.setProperty(S3Constants.PROPERTY_S3_VIRTUAL_HOST_BUCKETS, virtualHostValue);
      }
      return overrides;
    }
    
}
