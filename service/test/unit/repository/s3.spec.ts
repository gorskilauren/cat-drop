import sinon from 'sinon';
import { expect } from 'chai';
const proxyquire = require('proxyquire').noCallThru();
describe('s3', () => {
    let putObjectStub, listObjectsStub, listObjectsPromiseStub, S3Repo, now;
    beforeEach(() => {
        now = 123123123;
        sinon.useFakeTimers(now);
        putObjectStub = sinon.stub().returns({ promise: sinon.stub() });
        listObjectsPromiseStub = sinon.stub().returns();
        listObjectsStub = sinon.stub().returns({ promise: listObjectsPromiseStub });
        S3Repo = proxyquire('../../../src/repository/s3', {
            'aws-sdk':
            {
                'S3': sinon.stub().returns({
                    putObject: putObjectStub,
                    listObjects: listObjectsStub
                })
            }
        });
    });

    afterEach(() => sinon.restore());

    describe('uploadCatPic', () => {
        let catPic;
        beforeEach(async () => {
            catPic = Buffer.from('abc', 'base64');
            await S3Repo.uploadCatPic(catPic);
        });

        it('calls the s3 client with the expected cat pics', () => {
            expect(putObjectStub).to.be.calledOnceWithExactly({
                Body: catPic,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg',
                Key: `catPic-${now}`,
                StorageClass: 'STANDARD_IA',
                ServerSideEncryption: "AES256",
                Bucket: process.env.S3_BUCKET
            });
        });
    });

    describe('getCatPics', () => {

        let actualResult, expectedResult;
        describe('and the bucket contents exist', () => {
            beforeEach(async () => {
                expectedResult = ['some', 'cat', 'pics'];
                listObjectsPromiseStub.resolves({ 'Contents': expectedResult });
                actualResult = await S3Repo.getCatPics();
            });

            it('lists objects from the expected bucket', () => {
                expect(listObjectsStub).to.be.calledOnceWithExactly({
                    Bucket: process.env.S3_BUCKET
                });
            });

            it('returns bucket contents', () => {
                expect(actualResult).to.deep.equal(expectedResult);
            });
        });

        describe('and the bucket contents do not exist', () => {
            beforeEach(async () => {
                listObjectsPromiseStub.resolves();
                actualResult = await S3Repo.getCatPics();
            });

            it('lists objects from the expected bucket', () => {
                expect(listObjectsStub).to.be.calledOnceWithExactly({
                    Bucket: process.env.S3_BUCKET
                });
            });

            it('returns bucket contents', () => {
                expect(actualResult).to.deep.equal([]);
            });
        });
    });
});