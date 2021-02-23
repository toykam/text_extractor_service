module.exports = (router, db) => {
    router.post('/', (req, res) => {
        res.send(req.body)
    })
    return router
} 