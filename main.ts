import * as http from 'http';
import * as mongoose from 'mongoose';
import ExpressServer from './server/express-server';

const port =  3000;
ExpressServer.set('port', port);

const server = http.createServer(ExpressServer);
server.listen(port);
server.on('listening', onListening);

/*
    MONGOOSE CONNECTION:
    mongoose.connect('mongodb://<user>:<pass>@<url>:<port>/<database>');
*/

function onListening():void {
    console.log(`Server running on port ${port}...`);
}