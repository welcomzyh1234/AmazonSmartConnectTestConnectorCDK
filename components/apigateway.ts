import { Construct } from "@aws-cdk/core";

import * as apiGateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";

export interface APIGatewayConstructProps {
  readonly apiName: string;
  readonly endpointType: apiGateway.EndpointType;
  readonly cloudWatchRoleArn: string;
}

export class APIGatewayConstruct extends Construct {
  public readonly api: apiGateway.RestApi;

  constructor(scope: Construct, id: string, props: APIGatewayConstructProps) {
    super(scope, id);

    new apiGateway.CfnAccount(
      this,
      'Account',
      {
        cloudWatchRoleArn: props.cloudWatchRoleArn
      }
    );

    this.api = new apiGateway.RestApi(
      this,
      'Api',
      {
        restApiName: props.apiName,
        endpointConfiguration: {
          types: [props.endpointType]
        },
        cloudWatchRole: false // will use exising role <props.cloudWatchRoleArn>
      }
    );
  }

  public addInventoriesResource(lambdaFunction: lambda.Function) {
    const resource = this.addCorsResource(this.api.root, 'inventories');

    resource.addMethod('GET', new apiGateway.LambdaIntegration(lambdaFunction));
    resource.addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
  }

  public addOrderResource(lambdaFunction: lambda.Function) {
    const resource = this.addCorsResource(this.api.root, 'orders');
    const idResource = this.addCorsResource(resource, '{id}');
    const confirmOrderResource = this.addCorsResource(idResource, 'comfirm-order');

    resource.addMethod('GET', new apiGateway.LambdaIntegration(lambdaFunction));
    idResource.addMethod('GET', new apiGateway.LambdaIntegration(lambdaFunction));
    confirmOrderResource.addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));

    // new CfnOutput(this, `EndPoint${method}${id}`, { value: this.api.urlForPath(proxyResource.path) });
  }

  private addCorsResource(parentResource: apiGateway.IResource, resourceName: string) {
    const resource = parentResource.addResource(resourceName);
    this.addCorsOptions(resource);
    return resource;
  }

  private addCorsOptions(apiResource: apiGateway.IResource) {
    apiResource.addMethod(
      'OPTIONS',
      new apiGateway.MockIntegration({
        integrationResponses: [{
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials': "'false'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        }],
        passthroughBehavior: apiGateway.PassthroughBehavior.NEVER,
        requestTemplates: {
          "application/json": "{\"statusCode\": 200}"
        },
      }),
      {
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Methods': true,
              'method.response.header.Access-Control-Allow-Credentials': true,
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          }
        ]
      }
    )
  }
}