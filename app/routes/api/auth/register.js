const createUser = require('../../../controllers/user/create_user.controller')

module.exports = (router, db) => {
    router.post('/', (req, res) => {
        const user = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            lat: req.body.lat,
            lng: req.body.lng,
            type: 'basic'
        }
        createUser(db, user, (error, result) => {
            if (error) {
                res.send({error: 'An error occurred registering'})
            } else {
                res.send({message: result.message, data: result.data})
            }
        })
    })

    return router
} 