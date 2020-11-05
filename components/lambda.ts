import { Construct, Duration } from "@aws-cdk/core";

import * as lambda from "@aws-cdk/aws-lambda";
import * as lambdaEventSources from "@aws-cdk/aws-lambda-event-sources";
import * as apiGateway from "@aws-cdk/aws-apigateway";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";

export interface LambdaConstructProps {
  readonly lambdaName: string;
  readonly handler: string;
  readonly isFromS3: boolean;
  readonly runtime: lambda.Runtime;
  readonly role: iam.Role;
  readonly environment?: {
    [key: string]: string;
  };
  readonly s3BucketArn?: string,
  readonly s3Key?: string,
  readonly assetCodePath?: string
}

export class LambdaConstruct extends Construct {
  public readonly lambda: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaConstructProps) {
    super(scope, id);

    this.lambda = new lambda.Function(
      this,
      'Function',
      {
        // code: new lambda.AssetCode('lambdas'),
        code: this.getLambdaCode(props),
        handler: props.handler,
        runtime: props.runtime,
        environment: props.environment,
        timeout: Duration.seconds(300),
        memorySize: 512,
        role: props.role,
        functionName: props.lambdaName
      }
    );
  }

  public getLambdaIntegration(): apiGateway.LambdaIntegration {
    return new apiGateway.LambdaIntegration(this.lambda);
  }

  public addEventSource(s3Bucket: s3.Bucket) {
    this.lambda.addEventSource(
      new lambdaEventSources.S3EventSource(
        s3Bucket,
        {events: [s3.EventType.OBJECT_CREATED]}
      )
    );
  }

  private getLambdaCode(props: LambdaConstructProps): lambda.Code {
    if (props.isFromS3) {
      return lambda.S3Code.fromBucket(
        s3.Bucket.fromBucketArn(this, 'bucket', props.s3BucketArn!),
        props.s3Key!
      );
    }
    return new lambda.AssetCode(props.assetCodePath!);
  }
}