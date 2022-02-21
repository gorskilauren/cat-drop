import { StackProps, Stack, App, Duration, RemovalPolicy } from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { StaticWebHost } from './StaticWebHost';
import { Bucket } from '@aws-cdk/aws-s3';


export class CatStack extends Stack {
    constructor(app: App, id: string, stackProps: StackProps) {
        super(app, id, stackProps);

        const catPicsBucket = new Bucket(this, 'CatSite', {
            bucketName: 'cat-pics-for-cat-site',
            publicReadAccess: false,
            removalPolicy: RemovalPolicy.DESTROY
        });

        const catFunction = new Function(this, 'CatFunction', {
            code: Code.fromAsset(`${__dirname}/../../service/dist`),
            handler: 'lambda.handler',
            runtime: Runtime.NODEJS_12_X,
            timeout: Duration.minutes(1),
            environment: {
                S3_BUCKET: catPicsBucket.bucketName,
                CAT_MAX: '5'
            }
        });

        catPicsBucket.grantReadWrite(catFunction);

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
