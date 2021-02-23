const appVersionRoute = require('./version')
module.exports = (express, db) => {

    const router = express.Router()
    router.use('/version', appVersionRoute(express, db))
    return router;
}