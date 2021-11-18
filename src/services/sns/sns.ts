import * as AWSTypes from "aws-sdk";
import { config } from "../../config";
import { getLogger } from "../../util/logger";
import { AWS } from "../awsSdk";

const { trace } = getLogger("src/services/sns");
const sns = new AWS.SNS(config.notification.sns) as AWSTypes.SNS;

export const publish = (message: any) => {
  const publishMessage = {
    Message: JSON.stringify(message),
    TopicArn: config.notification.topicArn,
  };
  trace(`Publishing Notification : ${JSON.stringify(publishMessage)}`);
  return sns.publish(publishMessage).promise();
};

export const publishHealthCert = (message: any) => {
  const publishMessage = {
    Message: JSON.stringify(message),
    TopicArn: config.notification.healthCertTopicArn,
  };
  trace(`Publishing Healthcert Notification : ${JSON.stringify(publishMessage)}`);
  return sns.publish(publishMessage).promise();
};
