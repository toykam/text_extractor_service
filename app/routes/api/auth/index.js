module.exports = (express, db) => {
    const router = express.Router()
    router.use('/login', require('./login')(router, db))
    router.use('/register', require('./register')(router, db))
    return router
} 