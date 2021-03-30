import * as AWS from "aws-sdk";

const isTruthy = (val?: string) => {
  return val === "true" || val === "True";
};

// this function exists because serverless gives a string of "undefined" for unpopulated values
// https://github.com/serverless/serverless/issues/3491
const getDefaultIfUndefined = (envVar: string | undefined, defaultValue: string) => {
  return !envVar || envVar === "undefined" ? defaultValue : envVar;
};

const getSnsConfig = () =>
  process.env.IS_OFFLINE
    ? {
        region: getDefaultIfUndefined(process.env.SNS_REGION, "ap-southeast-1"),
        endpoint: new AWS.Endpoint("http://localhost:4566"),
        accessKeyId: "S3RVER",
        secretAccessKey: "S3RVER",
      }
    : {
        region: getDefaultIfUndefined(process.env.SNS_REGION, "ap-southeast-1"),
      };

const generateConfig = () => ({
  notification: {
    // Allow dev to test locally without setting up SNS
    enabled: isTruthy(process.env.NOTIFICATION_ENABLED),
    senderName: getDefaultIfUndefined(process.env.NOTIFICATION_SENDER_NAME, "NOTARISE"),
    senderLogo: getDefaultIfUndefined(process.env.NOTIFICATION_SENDER_LOGO, ""),
    templateID: getDefaultIfUndefined(process.env.NOTIFICATION_TEMPLATE_ID, "000"),
    sns: getSnsConfig(),
    topicArn: getDefaultIfUndefined(
      process.env.NOTIFICATION_TOPIC_ARN,
      "arn:aws:sns:ap-southeast-1:000000000000:PLACEHOLDER_SNS_TOPIC"
    ),
  },
});

export const config = generateConfig();
