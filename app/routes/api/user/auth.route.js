const createUser = require('../../../controllers/user/create_user.controller')

module.exports = (express, db) => {
    const router = express.Router()
    router.get('/', (req, res) => {
        res.send('This is the USER AUTH API base page')
    })
    router.post('/login', (req, res) => {
        console.log(req.body)
        res.send(req.body)
    })

    router.post('/register', (req, res) => {
        const user = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            lat: req.body.lat,
            lng: req.body.lng,
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