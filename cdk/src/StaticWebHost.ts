import { CloudFrontWebDistribution, OriginAccessIdentity } from "@aws-cdk/aws-cloudfront";
import { Bucket } from "@aws-cdk/aws-s3";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";
import { CfnOutput, Construct, RemovalPolicy } from "@aws-cdk/core";

export class StaticWebHost extends Construct {
    constructor(construct: Construct, id: string) {
        super(construct, id);

        const catOai = new OriginAccessIdentity(
            this,
            `CloudFrontOriginAccessIdentity`
          );

        const catSiteBucket = new Bucket(this, 'CatSite', {
            bucketName: 'cat-site',
            publicReadAccess: false,
            removalPolicy: RemovalPolicy.DESTROY
        });

        catSiteBucket.grantRead(catOai)

        const catDistribution = new CloudFrontWebDistribution(this, 'CatDistribution', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: catSiteBucket,
                        originAccessIdentity: catOai
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                    
                }
            ],
            errorConfigurations: [
                {
                  errorCode: 404,
                  responseCode: 200,
                  responsePagePath: '/index.html',
                },
                {
                  errorCode: 403,
                  responseCode: 200,
                  responsePagePath: '/index.html',
                },
              ]
        });

        new BucketDeployment(this, 'CatDeploy', {
            sources: [Source.asset(`${__dirname}/../../ui/public`)],
            destinationBucket: catSiteBucket,
            distribution: catDistribution,
            distributionPaths: ["/*"]
        });

        new CfnOutput(this, 'cloufront domain name', { value: catDistribution.distributionDomainName });
        new CfnOutput(this, 'cloufront id', { value: catDistribution.distributionId })

    }
}