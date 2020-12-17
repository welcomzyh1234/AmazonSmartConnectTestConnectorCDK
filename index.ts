import cdk = require('@aws-cdk/core');
import apigateway = require('@aws-cdk/aws-apigateway');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');

import { LambdaConstruct } from './components/lambda';
import { S3Construct } from './components/s3';
import { APIGatewayConstruct } from './components/apigateway';
import { AmplifyConstruct } from './components/amplify';
import { IAMConstruct } from './components/iam';


export class SmartConnectTestConnectorStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const iamConstruct = new IAMConstruct(
      this,
      'IAM',
      {
        assumedBy: new iam.CompositePrincipal(
          new iam.ServicePrincipal('lambda.amazonaws.com'),
          new iam.ServicePrincipal('apigateway.amazonaws.com')
        ),
        roleName: 'SmartConnectTestConnectorIAMRole'
      }
    );

    new AmplifyConstruct(
      this,
      'Amplify',
      {
        name: 'SmartConnectTestConnectorAmplifyApp',
        repository: 'https://github.com/welcomzyh1234/AmazonSmartConnectTestConnector',
        oauthToken: '645bb5afecc2be8c7c54b2d20acacb7a0ba4cc0d'

      }
    );

    const lambdaArtifactsS3Construct = new S3Construct(
      this,
      'S3',
      {
        bucketName: 'smart-connect-test-connector-lambda-bucket'
      }
    );

    const lambdaConstruct = new LambdaConstruct(
      this,
      'SmartConnectTestConnectorLambda',
      {
        role: iamConstruct.role,
        lambdaName: 'SmartConnectTestConnectorLambda',
        handler: 'lambda.Handler',
        runtime: lambda.Runtime.JAVA_8,
        // isFromS3: true,
        // s3BucketArn: 'arn:aws:s3:::smart-connect-test-connector-lambda-bucket',
        // s3Key: '6b0c862751b96a76188c8cea6fd3c8b9'
        isFromS3: false,
        assetCodePath: 'resources/deploy_updated_lambda_function'
      }
    );

    const autoDeployLambdaConstruct = new LambdaConstruct(
      this,
      'DeployUpdatedLambdaFromS3',
      {
        role: iamConstruct.role,
        lambdaName: 'DeployUpdatedLambdaFromS3',
        handler: 'deploy_updated_lambda_function.handler',
        runtime: lambda.Runtime.NODEJS_12_X,
        isFromS3: false,
        assetCodePath:'resources/deploy_updated_lambda_function',
        environment: {
          TARGET_LAMBDA_FUNCTION_NAME: lambdaConstruct.lambda.functionName
        }
      }
    );
    autoDeployLambdaConstruct.addEventSource(lambdaArtifactsS3Construct.s3);

    const apiGatewayConstruct = new APIGatewayConstruct(
      this,
      'Apigateway',
      {
        apiName: 'SmartConnectTestConnectorApi',
        endpointType: apigateway.EndpointType.EDGE,
        cloudWatchRoleArn: IAMConstruct.buildApiGatewayCloudWatchRole(this).roleArn
      }
    );
    apiGatewayConstruct.addInventoriesResource(lambdaConstruct.lambda);
    apiGatewayConstruct.addOrderResource(lambdaConstruct.lambda);
    apiGatewayConstruct.addPricesResource(lambdaConstruct.lambda);
    apiGatewayConstruct.addEventsResource(lambdaConstruct.lambda);
  }
}

const app = new cdk.App();
new SmartConnectTestConnectorStack(app, 'SmartConnectTestConnector');
app.synth();
