import * as express from 'express';
const router = express.Router();

router.route('/')
    .get((req, res) => {
        console.log('example');
        res.json({
            message: 'JSON from /example'
        });
    });

router.route('/function').get(printMessage);

function printMessage(req, res):void {
    res.json({
        message: 'I\'m from a function!'
    });
}

module.exports = router;