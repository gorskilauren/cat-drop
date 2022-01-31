import { StackProps, Stack, App, Duration } from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { StaticWebHost } from './StaticWebHost';


export class CatStack extends Stack {
    constructor(app: App, id: string, stackProps: StackProps) {
        super(app, id, stackProps);

        const catFunction = new Function(this, 'CatFunction', {
            code: Code.fromAsset(`${__dirname}/../../service/dist`),
            handler: 'lambda.handler',
            runtime: Runtime.NODEJS_12_X,
            timeout: Duration.minutes(1)
        });

        new LambdaRestApi(this, 'CatApi', {
            handler: catFunction,
            defaultCorsPreflightOptions: {
                allowOrigins: ['*'],
                allowMethods: ['ANY']
            },
        });

        new StaticWebHost(this, 'CatSiteConstruct');
        
    }
};
