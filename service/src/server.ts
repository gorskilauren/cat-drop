import express from 'express';
import cors from 'cors';

export default async () => {
    const server = express();

    server.use(cors());

    server.post('/cat-image', (req, res) => {
        console.log('i <3 cats!');
        res.sendStatus(204);
    })

    return server;
}

