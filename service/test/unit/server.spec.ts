import sinon from 'sinon';
import { expect } from 'chai';
import mockedEnv from 'mocked-env';
import * as S3Repo from '../../src/repository/s3';
const proxyquire = require('proxyquire').noCallThru();

describe('s3', () => {
    let expressPostStub, server, restore, mockRes, getCatPicsStub, uploadCatPicStub;
    beforeEach(async () => {
        restore = mockedEnv({
            IS_TEST: 'true',
            CAT_MAX: '5'
        });
        expressPostStub = sinon.stub()
        server = proxyquire('../../src/server', {
            'express': sinon.stub().returns({
                'post': expressPostStub,
                'use': sinon.stub()
            }),
        }).default;

        getCatPicsStub = sinon.stub(S3Repo, 'getCatPics');
        uploadCatPicStub = sinon.stub(S3Repo, 'uploadCatPic');


        mockRes = {
            status: sinon.stub().returns({ send: sinon.stub() }),
            sendStatus: sinon.stub()
        };

        await server();
    });

    afterEach(() => {
        sinon.restore();
        restore();
    });

    it('sets up the expected routes', () => {
        expect(expressPostStub.getCall(0).args[0]).to.equal('/cat-image')
    });

    describe('POST /cat-image', () => {
        let postCatImage;
        const expectedImage = Buffer.from('/abc', 'base64');
        const mockReq = {
            body: {
                image: 'data:image/jpeg;base64,/abc'
            }
        };

        beforeEach(() => {
            postCatImage = expressPostStub.getCall(0).args[1];
        });

        describe('when the file sent is an image', () => {

            describe('when fetching cat pics is successful', () => {

                describe('and the number of cats has not exceed the limit', () => {
                    beforeEach(async () => {
                        getCatPicsStub.resolves(['three', 'cat', 'pics'])
                        await postCatImage(mockReq, mockRes)
                    });

                    it('uploads the cat image', () => {
                        expect(uploadCatPicStub).to.be.calledOnceWithExactly(expectedImage)
                    });

                    it('returns a 204 response status', () => {
                        expect(mockRes.sendStatus).to.be.calledOnceWithExactly(204);
                    })
                });

                describe('and the number of cats has exceeded the limit', () => {
                    beforeEach(async () => {
                        getCatPicsStub.resolves(['far', 'too', 'many', 'cat', 'pics'])
                        await postCatImage(mockReq, mockRes)
                    });

                    it('does not upload the cat image', () => {
                        expect(uploadCatPicStub).to.not.be.called;
                    });

                    it('returns a 400 response status', () => {
                        expect(mockRes.status).to.be.calledOnceWithExactly(400);
                        expect(mockRes.status().send).to.be.calledOnceWithExactly('Too many cat pics!');
                    });
                });

            });

            describe('when fetching cat pics is unsuccessful', () => {
                beforeEach(async () => {
                    getCatPicsStub.rejects('Oh no! Not the cat pics!');
                    await postCatImage(mockReq, mockRes)
                });

                it('returns a 500 response status', () => {
                    expect(mockRes.status).to.be.calledOnceWithExactly(500);
                });
            });
        });

        describe('when the file sent is an image', () => {
            beforeEach(async () => {
                await postCatImage({body: {image: 'malicious!'}}, mockRes);
            });

            it('returns a 500', () => {
                expect(mockRes.status).to.be.calledOnceWithExactly(500);
            })
        });


    });

});