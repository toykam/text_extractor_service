module.exports = (express, db) => {
    const router = express.Router()
    router.get('/', (req, res) => {
        res.send('This is the API base page')
    })
    router.use('/user', require('./user/index')(express, db))
    router.use('/extractor', require('./extraction/index')(express, db))
    return router
}