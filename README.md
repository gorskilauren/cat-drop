# Cat Drop
## Vision
~~Silly~~ Highly sophisticated site to drop your favorite cat pics.

## Package Breakdown
### **cdk**
Utilize AWS CDK infrastructure as code to:
* Host single page svelte app via AWS CloudFront distribution and S3.
* Host backend via AWS lambda and API Gateway

### **ui**
Utilize [svelte](https://svelte.dev/docs) to build highly responsive, mobile friendly interface to drop cat pics.

### **service**
Utilize typescript and [express](https://www.npmjs.com/package/express) to host. This is intended to eventually process the cat pics before dropping them in S3. Needs work!