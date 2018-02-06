import * as express from 'express';
import { Paths } from './paths';

/*
    IMPORT ROUTE FILES HERE. EXAMPLE:
*/
import * as ExampleRoute from './routes/example-route';

class ExpressServer {
    public express:express.Application;
    public cors:Function = (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    }

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    private middleware():void {
        this.express.use(this.cors);
        this.express.use(express.static(`${Paths.__root}\\dist`));
    }

    private routes():void {
        let router = express.Router();
        this.express.use('/', router);
        /*
            ADD ROUTE USES HERE. EXAMPLE:
        */
        router.use('/example', ExampleRoute);

        // Re-direct to Angular front-end.
        router.get('*', (req, res) => {
            res.sendFile(`${Paths.__root}\\dist\\index.html`);
        });
    }
}
export default new ExpressServer().express;