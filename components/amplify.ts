import { Construct } from "@aws-cdk/core";

import * as amplify from "@aws-cdk/aws-amplify";

export class AmplifyConstruct extends Construct {
  public readonly amplifyApp: amplify.CfnApp;

  constructor(scope: Construct, id: string, props: amplify.CfnAppProps) {
    super(scope, id);

    this.amplifyApp = new amplify.CfnApp(this, 'App', props);

    new amplify.CfnBranch(
      this.amplifyApp,
      'MainBranch',
      {
        appId: this.amplifyApp.attrAppId,
        branchName: 'main'
      }
    );

    new amplify.CfnBranch(
      this.amplifyApp,
      'TestBranch',
      {
        appId: this.amplifyApp.attrAppId,
        branchName: 'test'
      }
    );
  }
}