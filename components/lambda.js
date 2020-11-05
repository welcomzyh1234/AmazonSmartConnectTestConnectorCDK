"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const lambdaEventSources = require("@aws-cdk/aws-lambda-event-sources");
const apiGateway = require("@aws-cdk/aws-apigateway");
const s3 = require("@aws-cdk/aws-s3");
class LambdaConstruct extends core_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.lambda = new lambda.Function(this, 'Function', {
            // code: new lambda.AssetCode('lambdas'),
            code: this.getLambdaCode(props),
            handler: props.handler,
            runtime: props.runtime,
            environment: props.environment,
            timeout: core_1.Duration.seconds(300),
            memorySize: 512,
            role: props.role,
            functionName: props.lambdaName
        });
    }
    getLambdaIntegration() {
        return new apiGateway.LambdaIntegration(this.lambda);
    }
    addEventSource(s3Bucket) {
        this.lambda.addEventSource(new lambdaEventSources.S3EventSource(s3Bucket, { events: [s3.EventType.OBJECT_CREATED] }));
    }
    getLambdaCode(props) {
        if (props.isFromS3) {
            return lambda.S3Code.fromBucket(s3.Bucket.fromBucketArn(this, 'bucket', props.s3BucketArn), props.s3Key);
        }
        return new lambda.AssetCode(props.assetCodePath);
    }
}
exports.LambdaConstruct = LambdaConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQW9EO0FBRXBELDhDQUE4QztBQUM5Qyx3RUFBd0U7QUFDeEUsc0RBQXNEO0FBRXRELHNDQUFzQztBQWdCdEMsTUFBYSxlQUFnQixTQUFRLGdCQUFTO0lBRzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMkI7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FDL0IsSUFBSSxFQUNKLFVBQVUsRUFDVjtZQUNFLHlDQUF5QztZQUN6QyxJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7WUFDL0IsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIsT0FBTyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQzlCLFVBQVUsRUFBRSxHQUFHO1lBQ2YsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLFlBQVksRUFBRSxLQUFLLENBQUMsVUFBVTtTQUMvQixDQUNGLENBQUM7SUFDSixDQUFDO0lBRU0sb0JBQW9CO1FBQ3pCLE9BQU8sSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFTSxjQUFjLENBQUMsUUFBbUI7UUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQ3hCLElBQUksa0JBQWtCLENBQUMsYUFBYSxDQUNsQyxRQUFRLEVBQ1IsRUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUFDLENBQ3hDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFTyxhQUFhLENBQUMsS0FBMkI7UUFDL0MsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2xCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQzdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLFdBQVksQ0FBQyxFQUMzRCxLQUFLLENBQUMsS0FBTSxDQUNiLENBQUM7U0FDSDtRQUNELE9BQU8sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxhQUFjLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0Y7QUE3Q0QsMENBNkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0LCBEdXJhdGlvbiB9IGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5cbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tIFwiQGF3cy1jZGsvYXdzLWxhbWJkYVwiO1xuaW1wb3J0ICogYXMgbGFtYmRhRXZlbnRTb3VyY2VzIGZyb20gXCJAYXdzLWNkay9hd3MtbGFtYmRhLWV2ZW50LXNvdXJjZXNcIjtcbmltcG9ydCAqIGFzIGFwaUdhdGV3YXkgZnJvbSBcIkBhd3MtY2RrL2F3cy1hcGlnYXRld2F5XCI7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSBcIkBhd3MtY2RrL2F3cy1pYW1cIjtcbmltcG9ydCAqIGFzIHMzIGZyb20gXCJAYXdzLWNkay9hd3MtczNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBMYW1iZGFDb25zdHJ1Y3RQcm9wcyB7XG4gIHJlYWRvbmx5IGxhbWJkYU5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgaGFuZGxlcjogc3RyaW5nO1xuICByZWFkb25seSBpc0Zyb21TMzogYm9vbGVhbjtcbiAgcmVhZG9ubHkgcnVudGltZTogbGFtYmRhLlJ1bnRpbWU7XG4gIHJlYWRvbmx5IHJvbGU6IGlhbS5Sb2xlO1xuICByZWFkb25seSBlbnZpcm9ubWVudD86IHtcbiAgICBba2V5OiBzdHJpbmddOiBzdHJpbmc7XG4gIH07XG4gIHJlYWRvbmx5IHMzQnVja2V0QXJuPzogc3RyaW5nLFxuICByZWFkb25seSBzM0tleT86IHN0cmluZyxcbiAgcmVhZG9ubHkgYXNzZXRDb2RlUGF0aD86IHN0cmluZ1xufVxuXG5leHBvcnQgY2xhc3MgTGFtYmRhQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHJlYWRvbmx5IGxhbWJkYTogbGFtYmRhLkZ1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBMYW1iZGFDb25zdHJ1Y3RQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLmxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgJ0Z1bmN0aW9uJyxcbiAgICAgIHtcbiAgICAgICAgLy8gY29kZTogbmV3IGxhbWJkYS5Bc3NldENvZGUoJ2xhbWJkYXMnKSxcbiAgICAgICAgY29kZTogdGhpcy5nZXRMYW1iZGFDb2RlKHByb3BzKSxcbiAgICAgICAgaGFuZGxlcjogcHJvcHMuaGFuZGxlcixcbiAgICAgICAgcnVudGltZTogcHJvcHMucnVudGltZSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHByb3BzLmVudmlyb25tZW50LFxuICAgICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMwMCksXG4gICAgICAgIG1lbW9yeVNpemU6IDUxMixcbiAgICAgICAgcm9sZTogcHJvcHMucm9sZSxcbiAgICAgICAgZnVuY3Rpb25OYW1lOiBwcm9wcy5sYW1iZGFOYW1lXG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRMYW1iZGFJbnRlZ3JhdGlvbigpOiBhcGlHYXRld2F5LkxhbWJkYUludGVncmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IGFwaUdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24odGhpcy5sYW1iZGEpO1xuICB9XG5cbiAgcHVibGljIGFkZEV2ZW50U291cmNlKHMzQnVja2V0OiBzMy5CdWNrZXQpIHtcbiAgICB0aGlzLmxhbWJkYS5hZGRFdmVudFNvdXJjZShcbiAgICAgIG5ldyBsYW1iZGFFdmVudFNvdXJjZXMuUzNFdmVudFNvdXJjZShcbiAgICAgICAgczNCdWNrZXQsXG4gICAgICAgIHtldmVudHM6IFtzMy5FdmVudFR5cGUuT0JKRUNUX0NSRUFURURdfVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGdldExhbWJkYUNvZGUocHJvcHM6IExhbWJkYUNvbnN0cnVjdFByb3BzKTogbGFtYmRhLkNvZGUge1xuICAgIGlmIChwcm9wcy5pc0Zyb21TMykge1xuICAgICAgcmV0dXJuIGxhbWJkYS5TM0NvZGUuZnJvbUJ1Y2tldChcbiAgICAgICAgczMuQnVja2V0LmZyb21CdWNrZXRBcm4odGhpcywgJ2J1Y2tldCcsIHByb3BzLnMzQnVja2V0QXJuISksXG4gICAgICAgIHByb3BzLnMzS2V5IVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBsYW1iZGEuQXNzZXRDb2RlKHByb3BzLmFzc2V0Q29kZVBhdGghKTtcbiAgfVxufSJdfQ==