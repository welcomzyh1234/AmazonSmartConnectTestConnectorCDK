import { Construct } from "@aws-cdk/core";

import * as iam from "@aws-cdk/aws-iam";

export class IAMConstruct extends Construct {
  public readonly role: iam.Role;

  constructor(scope: Construct, id: string, props: iam.RoleProps) {
    super(scope, id);

    this.role = new iam.Role(this, 'Role', props);
    this.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSLambdaFullAccess'));
    this.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAPIGatewayInvokeFullAccess'));
    this.role.addManagedPolicy(
      iam.ManagedPolicy.fromManagedPolicyArn(
        this.role,
        'CloudWatchPolicy',
        'arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs'
      )
    );
  }

  public static buildApiGatewayCloudWatchRole(scope: Construct): iam.Role {
    const apiGatewayCloudWatchRole = new iam.Role(
      scope,
      'ApiGatewayCloudWatchRole',
      {
        assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
        roleName: 'ApiGatewayCloudWatchRole',
      }
    );
    apiGatewayCloudWatchRole.addManagedPolicy(
      iam.ManagedPolicy.fromManagedPolicyArn(
        apiGatewayCloudWatchRole,
        'CloudWatchPolicy',
        'arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs'
      )
    );
    return apiGatewayCloudWatchRole;
  }
}