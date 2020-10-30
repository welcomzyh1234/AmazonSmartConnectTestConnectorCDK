const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.handler = function(event, context) {
    const functionName = process.env.TARGET_LAMBDA_FUNCTION_NAME;
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    console.log("uploaded to lambda function: " + functionName);
    
    const params = {
        FunctionName: functionName,
        S3Key: key,
        S3Bucket: bucket
    };
    lambda.updateFunctionCode(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            context.fail(err);
        }
        else {
            console.log(data);
            context.succeed(data);
        }
    });
}
