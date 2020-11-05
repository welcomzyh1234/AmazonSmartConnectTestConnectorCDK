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

  public addPricesResource(lambdaFunction: lambda.Function) {
    const resource = this.addCorsResource(this.api.root, 'prices');
    resource.addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
  }

  public addOrderResource(lambdaFunction: lambda.Function) {
    const resource = this.addCorsResource(this.api.root, 'orders');
    this.addCorsResource(resource, 'get-order').addMethod('GET', new apiGateway.LambdaIntegration(lambdaFunction));
    this.addCorsResource(resource, 'list-orders').addMethod('GET', new apiGateway.LambdaIntegration(lambdaFunction));
    this.addCorsResource(resource, 'confirm-order').addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
    this.addCorsResource(resource, 'create-packages').addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
    this.addCorsResource(resource, 'generate-invoice').addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
    this.addCorsResource(resource, 'generate-ship-label').addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
    this.addCorsResource(resource, 'regenerate-ship-label').addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
    this.addCorsResource(resource, 'reject-order').addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
    this.addCorsResource(resource, 'retrieve-invoice').addMethod('GET', new apiGateway.LambdaIntegration(lambdaFunction));
    this.addCorsResource(resource, 'retrieve-pickup-slots').addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
    this.addCorsResource(resource, 'retrieve-ship-label').addMethod('GET', new apiGateway.LambdaIntegration(lambdaFunction));
    this.addCorsResource(resource, 'ship-order').addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
    this.addCorsResource(resource, 'update-packages').addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
  }

  public addEventsResource(lambdaFunction: lambda.Function) {
    const eventsResource = this.addCorsResource(this.api.root, 'events');
    const subscriptionsResource = this.addCorsResource(eventsResource, 'subscriptions');
    subscriptionsResource.addMethod('GET', new apiGateway.LambdaIntegration(lambdaFunction));
    subscriptionsResource.addMethod('POST', new apiGateway.LambdaIntegration(lambdaFunction));
    subscriptionsResource.addMethod('DELETE', new apiGateway.LambdaIntegration(lambdaFunction));
    subscriptionsResource.addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));

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
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-Amz-Access-Token'",
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