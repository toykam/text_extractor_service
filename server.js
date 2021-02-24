const express = require('express')
const mongoClient = require('mongodb').MongoClient
const db = require('./config/db')
const fileUpload = require('express-fileupload')

const app = express();

const PORT = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(fileUpload())


const connectDatabase = () => {
    console.log('Connecting to database...')
    mongoClient.connect(db.url, (err,  database) => {
        if (err) {
            setTimeout(() => connectDatabase(), 10000)
            connectDatabase()
            console.log(`Database Error occurred ${err}`)
            // return ;
        } else {
            app.use('/api', require('./app/routes/api/index')(express, database.db('text_extraction')))
            // app.use('/web', require('./app/routes/web/index')(express, database))
            
            app.get('/', (req, res) => {
                res.send('<h1>Image Text Extractor Service Api</h1>')
            })

            app.use('/api/user', (req, res, next) => {
                console.log('user endpoint got hit')
                next()
            })

            app.use('/api', (req, res, next) => {
                console.log('api endpoint got hit')
                next()
            })

            app.use('/api/extractor', (req, res, next) => {
                console.log('extractor endpoint got hit')
                next()
            })
            
            app.listen(PORT, () => console.log('Server Is Live'))
        }
    })
}

connectDatabase()