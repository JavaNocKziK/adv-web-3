import * as http from 'http';
import * as mongoose from 'mongoose';
import ExpressServer from './server/express-server';

const port =  3000;
ExpressServer.set('port', port);

const server = http.createServer(ExpressServer);
server.listen(port);
server.on('listening', onListening);


    // MONGOOSE CONNECTION:
    // mongoose.connect('mongodb://<user>:<pass>@<url>:<port>/<database>');
    // mongoose.connect('mongodb://elliot:Rugger126@ds233238.mlab.com:33238/adv-web-2-db');
    mongoose.connect('mongodb://localhost:27017/advanced_web');


function onListening():void {
    console.log(`Server running on port ${port}...`);
}