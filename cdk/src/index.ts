import * as cdk from '@aws-cdk/core';
import { CatStack } from './CatStack';

const app = new cdk.App();

new CatStack(app, 'CatStack', {
  env: {
    account: process.env.AWS_DEFAULT_ACCOUNT,
    region: 'us-east-2'
  }
})
