module.exports = (express, db) => {
    const router = express.Router()
    router.get('/', (req, res) => {
        res.send('This is the USER AUTH API base page')
    })
    router.post('/login', (req, res) => {
        console.log(req.body)
        res.send(req.body)
    })

    
    return router
}