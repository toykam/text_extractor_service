module.exports = (express, db) => {

    const router = express.Router()
    router.get('/', (req, res) => {
        db.collection('app_detail').find({'latest': true}).toArray((err, result) => {
            if (err) {
                console.log(err)
                res.send({error: 'An error occurred, Please try again later'})
            } else {
                // console.log(result)
                res.send({data: result})
            }
        })
    })
    return router;
}