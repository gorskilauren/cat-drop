import {S3} from 'aws-sdk';

const s3Client = new S3({region: 'us-east-2'});

export const uploadCatPic = async (catPic) => {
    await s3Client.putObject({
        Body: catPic,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        Key: `catPic-${Date.now()}`,
        StorageClass: 'STANDARD_IA',
        ServerSideEncryption: "AES256", 
        Bucket: process.env.S3_BUCKET
    }).promise()
}

export const getCatPics = async () => {
    const bucketObjects = await s3Client.listObjects({
        Bucket: process.env.S3_BUCKET
    }).promise();
    return bucketObjects ? bucketObjects['Contents'] : [];
}