import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import AWSXRay from "aws-xray-sdk-core";
import { config } from "../../config";

let sns = new SNSClient(config.notification.sns);

sns = AWSXRay.captureAWSv3Client(sns);

export const publish = async (message: any) => {
  const command = new PublishCommand({
    Message: JSON.stringify(message),
    TopicArn: config.notification.topicArn,
  });

  return sns.send(command);
};

export const publishHealthCert = async (message: any) => {
  const command = new PublishCommand({
    Message: JSON.stringify(message),
    TopicArn: config.notification.healthCertTopicArn,
  });

  return sns.send(command);
};
