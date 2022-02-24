import express from 'express';
import cors from 'cors';
import * as S3Repo from './repository/s3';
require('dotenv').config()

export default async () => {
    const server = express();
    server.use(process.env.IS_TEST || express.json({limit: '10mb'}));
    server.use(cors());

    const convertImageToBase64 = (image) => {
        const parsedImage = image.replace(/^data:image\/\w+;base64,/, "");
        return Buffer.from(parsedImage, 'base64');
    }

    const validateImage = (body) => {
        if(!body.image || !body.image.includes('data:image')) {
            throw new Error('invalid image provided');
        }
    }

    server.post('/cat-image', async (req, res) => {
        try {
            console.log('i <3 cats!');
            validateImage(req.body);
            const currentCatPics = await S3Repo.getCatPics();
            if (currentCatPics.length < +process.env.CAT_MAX) {
                await S3Repo.uploadCatPic(convertImageToBase64(req.body.image))
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

