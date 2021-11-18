import * as AWSTypes from "aws-sdk";
import { config } from "../../config";
import { getLogger } from "../../util/logger";
import { AWS } from "../awsSdk";

const { trace } = getLogger("src/services/sns");
const sns = new AWS.SNS(config.notification.sns) as AWSTypes.SNS;

export const publish = (message: any) => {
  trace(`Publising Notification Arn : ${config.notification.topicArn}`);
  return sns
    .publish({
      Message: JSON.stringify(message),
      TopicArn: config.notification.topicArn,
    })
    .promise();
};

export const publishHealthCert = (message: any) => {
  trace(`Publising Healthcert Notification Arn : ${config.notification.healthCertTopicArn}`);
  return sns
    .publish({
      Message: JSON.stringify(message),
      TopicArn: config.notification.healthCertTopicArn,
    })
    .promise();
};
