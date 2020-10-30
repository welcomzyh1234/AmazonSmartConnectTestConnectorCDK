import { Construct, RemovalPolicy } from "@aws-cdk/core";

import * as s3 from "@aws-cdk/aws-s3";

export interface S3ConstructProps {
  readonly bucketName: string;
  readonly encryption?: s3.BucketEncryption;
}

export class S3Construct extends Construct {
  public readonly s3: s3.Bucket;

  constructor(scope: Construct, id: string, props: S3ConstructProps) {
    super(scope, id);

    this.s3 = new s3.Bucket(
      this,
      'LambdaArtifactsBucket',
      {
        bucketName: props.bucketName,
        removalPolicy: RemovalPolicy.DESTROY,
      }
    );
  }
}