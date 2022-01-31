import server from './server';

server().then(app => app.listen(3000, () => console.log('listening on port 3000...')));