# aws-s3 with java

# blobstore-basics

This is a simple example command line client that creates a container in a [BlobStore](http://jclouds.apache.org/start/blobstore/) provider and lists the size of all the other containers.

## Build

Ensure you have maven 3.02 or higher installed, then execute 'mvn install' to build the example.

## Run

Invoke the jar, passing the name of the cloud provider you with to access (ex. aws-s3, googlestorage), identity (ex. accesskey, username), credential (ex. secretkey, password), then the name of the container you'd like to create.

For Amazon S3

    java -jar target/blobstore-basics-jar-with-dependencies.jar 

## License

Copyright (C) 2009-2014 The Apache Software Foundation

Licensed under the Apache License, Version 2.0 
