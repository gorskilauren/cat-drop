# Cat Drop
## Vision
~~Silly~~ Highly sophisticated site to drop your favorite cat pics.

## Architecture Diagram
```mermaid
    flowchart LR
        User((Cat Drop User))
        CFDist[Cloudfront Distribution]
        S3_Cat[(S3 cat pics)]
        S3_UI[(S3 UI)]
        ApiGW[Api Gateway]
        Lambda[λ]
        BucketCheck{Max number of cat pics?}

    User-->CFDist
    CFDist-- Fetch page content -->S3_UI
    CFDist-- Submit image -->ApiGW
    ApiGW-->Lambda

    Lambda-- Get count of current cat pics-->S3_Cat
    Lambda---->BucketCheck
    BucketCheck -->|Yes| Error_Response[400 error response]
    BucketCheck -->|No| Success_response[Upload cat pics]
    Success_response --> S3_Cat
```

## Package Breakdown
### **cdk**
Utilize AWS CDK infrastructure as code to:
* Host single page svelte app via AWS CloudFront distribution and S3.
* Host backend via AWS lambda and API Gateway

### **ui**
Utilize [svelte](https://svelte.dev/docs) to build highly responsive, mobile friendly interface to drop cat pics.

### **service**
Utilize typescript and [express](https://www.npmjs.com/package/express) to host backend. The backend does some basic verification (i.e. submitted image size, and total count of cat pics do not exceed maximums) before saving the image to S3. Needs work!
