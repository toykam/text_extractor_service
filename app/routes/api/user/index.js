module.exports = (express, db) => {
    const router = express.Router()
    router.get('/', (req, res) => {
        res.send('This is the USER API base page')
    })
    router.use('/auth', require('./auth.route')(express, db))
    return router
}