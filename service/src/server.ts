import express from 'express';
import cors from 'cors';
import * as S3Service from './repository/s3';
require('dotenv').config()

export default async () => {
    const server = express();
    server.use(express.json({limit: '2mb'}));
    server.use(cors());

    const convertImageToBase64 = (image) => {
        const parsedImage = image.replace(/^data:image\/\w+;base64,/, "");
        return Buffer.from(parsedImage, 'base64');
    }

    server.post('/cat-image', async (req, res) => {
        try {
            console.log('i <3 cats!');
            const currentCatPics = await S3Service.getCatPics();
            if (currentCatPics.length < +process.env.CAT_MAX) {
                await S3Service.uploadCatPic(convertImageToBase64(req.body.image))
                res.sendStatus(204);
            } else {
                res.status(400).send('Too many cat pics!')
            }
        } catch(err) {
            console.log('Error uploading cat image', err);
            res.status(500).send('Something went wrong :(')
        }
        
    })

    return server;
}

