#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CloudInfraStack } from '../lib/cloud-infra-stack';


let keypairName = '';
try {
  keypairName = process.env.EC2_KEY!;
} catch(e) {
  throw new Error("EC2_KEY environment variable required.");
}

let safeIp = '';
try {
  safeIp = process.env.SAFE_IP!;
} catch(e) {
  throw new Error('SAFE_IP environment variable required.')
}

const app = new cdk.App();
new CloudInfraStack(app, 'GreeterRestApiCloudInfraStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: {
    account: process.env.AWS_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.AWS_REGION || process.env.CDK_DEFAULT_REGION
  },
  
  keypairName,
  safeIp
});