"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const apiGateway = require("@aws-cdk/aws-apigateway");
class APIGatewayConstruct extends core_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        new apiGateway.CfnAccount(this, 'Account', {
            cloudWatchRoleArn: props.cloudWatchRoleArn
        });
        this.api = new apiGateway.RestApi(this, 'Api', {
            restApiName: props.apiName,
            endpointConfiguration: {
                types: [props.endpointType]
            },
            cloudWatchRole: false // will use exising role <props.cloudWatchRoleArn>
        });
    }
    addInventoriesResource(lambdaFunction) {
        const resource = this.addCorsResource(this.api.root, 'inventories');
        resource.addMethod('GET', new apiGateway.LambdaIntegration(lambdaFunction));
        resource.addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
    }
    addOrderResource(lambdaFunction) {
        const resource = this.addCorsResource(this.api.root, 'orders');
        const idResource = this.addCorsResource(resource, '{id}');
        const confirmOrderResource = this.addCorsResource(idResource, 'comfirm-order');
        resource.addMethod('GET', new apiGateway.LambdaIntegration(lambdaFunction));
        idResource.addMethod('GET', new apiGateway.LambdaIntegration(lambdaFunction));
        confirmOrderResource.addMethod('PUT', new apiGateway.LambdaIntegration(lambdaFunction));
        // new CfnOutput(this, `EndPoint${method}${id}`, { value: this.api.urlForPath(proxyResource.path) });
    }
    addCorsResource(parentResource, resourceName) {
        const resource = parentResource.addResource(resourceName);
        this.addCorsOptions(resource);
        return resource;
    }
    addCorsOptions(apiResource) {
        apiResource.addMethod('OPTIONS', new apiGateway.MockIntegration({
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
        }), {
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
        });
    }
}
exports.APIGatewayConstruct = APIGatewayConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpZ2F0ZXdheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwaWdhdGV3YXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBMEM7QUFFMUMsc0RBQXNEO0FBU3RELE1BQWEsbUJBQW9CLFNBQVEsZ0JBQVM7SUFHaEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUErQjtRQUN2RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FDdkIsSUFBSSxFQUNKLFNBQVMsRUFDVDtZQUNFLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7U0FDM0MsQ0FDRixDQUFDO1FBRUYsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQy9CLElBQUksRUFDSixLQUFLLEVBQ0w7WUFDRSxXQUFXLEVBQUUsS0FBSyxDQUFDLE9BQU87WUFDMUIscUJBQXFCLEVBQUU7Z0JBQ3JCLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7YUFDNUI7WUFDRCxjQUFjLEVBQUUsS0FBSyxDQUFDLGtEQUFrRDtTQUN6RSxDQUNGLENBQUM7SUFDSixDQUFDO0lBRU0sc0JBQXNCLENBQUMsY0FBK0I7UUFDM0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUVwRSxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQzVFLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVNLGdCQUFnQixDQUFDLGNBQStCO1FBQ3JELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0QsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDMUQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUUvRSxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQzVFLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsb0JBQW9CLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBRXhGLHFHQUFxRztJQUN2RyxDQUFDO0lBRU8sZUFBZSxDQUFDLGNBQW9DLEVBQUUsWUFBb0I7UUFDaEYsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFTyxjQUFjLENBQUMsV0FBaUM7UUFDdEQsV0FBVyxDQUFDLFNBQVMsQ0FDbkIsU0FBUyxFQUNULElBQUksVUFBVSxDQUFDLGVBQWUsQ0FBQztZQUM3QixvQkFBb0IsRUFBRSxDQUFDO29CQUNyQixVQUFVLEVBQUUsS0FBSztvQkFDakIsa0JBQWtCLEVBQUU7d0JBQ2xCLHFEQUFxRCxFQUFFLHlGQUF5Rjt3QkFDaEosb0RBQW9ELEVBQUUsS0FBSzt3QkFDM0QseURBQXlELEVBQUUsU0FBUzt3QkFDcEUscURBQXFELEVBQUUsK0JBQStCO3FCQUN2RjtpQkFDRixDQUFDO1lBQ0YsbUJBQW1CLEVBQUUsVUFBVSxDQUFDLG1CQUFtQixDQUFDLEtBQUs7WUFDekQsZ0JBQWdCLEVBQUU7Z0JBQ2hCLGtCQUFrQixFQUFFLHVCQUF1QjthQUM1QztTQUNGLENBQUMsRUFDRjtZQUNFLGVBQWUsRUFBRTtnQkFDZjtvQkFDRSxVQUFVLEVBQUUsS0FBSztvQkFDakIsa0JBQWtCLEVBQUU7d0JBQ2xCLHFEQUFxRCxFQUFFLElBQUk7d0JBQzNELHFEQUFxRCxFQUFFLElBQUk7d0JBQzNELHlEQUF5RCxFQUFFLElBQUk7d0JBQy9ELG9EQUFvRCxFQUFFLElBQUk7cUJBQzNEO2lCQUNGO2FBQ0Y7U0FDRixDQUNGLENBQUE7SUFDSCxDQUFDO0NBQ0Y7QUFyRkQsa0RBcUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcblxuaW1wb3J0ICogYXMgYXBpR2F0ZXdheSBmcm9tIFwiQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXlcIjtcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tIFwiQGF3cy1jZGsvYXdzLWxhbWJkYVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFQSUdhdGV3YXlDb25zdHJ1Y3RQcm9wcyB7XG4gIHJlYWRvbmx5IGFwaU5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgZW5kcG9pbnRUeXBlOiBhcGlHYXRld2F5LkVuZHBvaW50VHlwZTtcbiAgcmVhZG9ubHkgY2xvdWRXYXRjaFJvbGVBcm46IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEFQSUdhdGV3YXlDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgYXBpOiBhcGlHYXRld2F5LlJlc3RBcGk7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFQSUdhdGV3YXlDb25zdHJ1Y3RQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBuZXcgYXBpR2F0ZXdheS5DZm5BY2NvdW50KFxuICAgICAgdGhpcyxcbiAgICAgICdBY2NvdW50JyxcbiAgICAgIHtcbiAgICAgICAgY2xvdWRXYXRjaFJvbGVBcm46IHByb3BzLmNsb3VkV2F0Y2hSb2xlQXJuXG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMuYXBpID0gbmV3IGFwaUdhdGV3YXkuUmVzdEFwaShcbiAgICAgIHRoaXMsXG4gICAgICAnQXBpJyxcbiAgICAgIHtcbiAgICAgICAgcmVzdEFwaU5hbWU6IHByb3BzLmFwaU5hbWUsXG4gICAgICAgIGVuZHBvaW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIHR5cGVzOiBbcHJvcHMuZW5kcG9pbnRUeXBlXVxuICAgICAgICB9LFxuICAgICAgICBjbG91ZFdhdGNoUm9sZTogZmFsc2UgLy8gd2lsbCB1c2UgZXhpc2luZyByb2xlIDxwcm9wcy5jbG91ZFdhdGNoUm9sZUFybj5cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHVibGljIGFkZEludmVudG9yaWVzUmVzb3VyY2UobGFtYmRhRnVuY3Rpb246IGxhbWJkYS5GdW5jdGlvbikge1xuICAgIGNvbnN0IHJlc291cmNlID0gdGhpcy5hZGRDb3JzUmVzb3VyY2UodGhpcy5hcGkucm9vdCwgJ2ludmVudG9yaWVzJyk7XG5cbiAgICByZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlHYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGxhbWJkYUZ1bmN0aW9uKSk7XG4gICAgcmVzb3VyY2UuYWRkTWV0aG9kKCdQVVQnLCBuZXcgYXBpR2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihsYW1iZGFGdW5jdGlvbikpO1xuICB9XG5cbiAgcHVibGljIGFkZE9yZGVyUmVzb3VyY2UobGFtYmRhRnVuY3Rpb246IGxhbWJkYS5GdW5jdGlvbikge1xuICAgIGNvbnN0IHJlc291cmNlID0gdGhpcy5hZGRDb3JzUmVzb3VyY2UodGhpcy5hcGkucm9vdCwgJ29yZGVycycpO1xuICAgIGNvbnN0IGlkUmVzb3VyY2UgPSB0aGlzLmFkZENvcnNSZXNvdXJjZShyZXNvdXJjZSwgJ3tpZH0nKTtcbiAgICBjb25zdCBjb25maXJtT3JkZXJSZXNvdXJjZSA9IHRoaXMuYWRkQ29yc1Jlc291cmNlKGlkUmVzb3VyY2UsICdjb21maXJtLW9yZGVyJyk7XG5cbiAgICByZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlHYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGxhbWJkYUZ1bmN0aW9uKSk7XG4gICAgaWRSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlHYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGxhbWJkYUZ1bmN0aW9uKSk7XG4gICAgY29uZmlybU9yZGVyUmVzb3VyY2UuYWRkTWV0aG9kKCdQVVQnLCBuZXcgYXBpR2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihsYW1iZGFGdW5jdGlvbikpO1xuXG4gICAgLy8gbmV3IENmbk91dHB1dCh0aGlzLCBgRW5kUG9pbnQke21ldGhvZH0ke2lkfWAsIHsgdmFsdWU6IHRoaXMuYXBpLnVybEZvclBhdGgocHJveHlSZXNvdXJjZS5wYXRoKSB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkQ29yc1Jlc291cmNlKHBhcmVudFJlc291cmNlOiBhcGlHYXRld2F5LklSZXNvdXJjZSwgcmVzb3VyY2VOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IHBhcmVudFJlc291cmNlLmFkZFJlc291cmNlKHJlc291cmNlTmFtZSk7XG4gICAgdGhpcy5hZGRDb3JzT3B0aW9ucyhyZXNvdXJjZSk7XG4gICAgcmV0dXJuIHJlc291cmNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRDb3JzT3B0aW9ucyhhcGlSZXNvdXJjZTogYXBpR2F0ZXdheS5JUmVzb3VyY2UpIHtcbiAgICBhcGlSZXNvdXJjZS5hZGRNZXRob2QoXG4gICAgICAnT1BUSU9OUycsXG4gICAgICBuZXcgYXBpR2F0ZXdheS5Nb2NrSW50ZWdyYXRpb24oe1xuICAgICAgICBpbnRlZ3JhdGlvblJlc3BvbnNlczogW3tcbiAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgICAgICByZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiBcIidDb250ZW50LVR5cGUsWC1BbXotRGF0ZSxBdXRob3JpemF0aW9uLFgtQXBpLUtleSxYLUFtei1TZWN1cml0eS1Ub2tlbixYLUFtei1Vc2VyLUFnZW50J1wiLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogXCInKidcIixcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogXCInZmFsc2UnXCIsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogXCInT1BUSU9OUyxHRVQsUFVULFBPU1QsREVMRVRFJ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgICBwYXNzdGhyb3VnaEJlaGF2aW9yOiBhcGlHYXRld2F5LlBhc3N0aHJvdWdoQmVoYXZpb3IuTkVWRVIsXG4gICAgICAgIHJlcXVlc3RUZW1wbGF0ZXM6IHtcbiAgICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIjogXCJ7XFxcInN0YXR1c0NvZGVcXFwiOiAyMDB9XCJcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAge1xuICAgICAgICBtZXRob2RSZXNwb25zZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IHRydWUsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKVxuICB9XG59Il19