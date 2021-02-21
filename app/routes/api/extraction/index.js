module.exports = (express, db) => {
    const router = express.Router()
    router.get('/', (req, res) => {
        res.send('This is the EXTRACTION API base page')
    })

    router.get('/langs', (req, res) => {
        db.collection('langs').find({}).toArray((err, result) => {
            // res.send(result)
            if (err) {
                res.send({error: 'An error occurred'})
            } else {
                res.send({message: 'hello', data: result})
            }
        })
    })
    return router
}