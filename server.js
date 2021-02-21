const express = require('express')
const mongoClient = require('mongodb').MongoClient
const db = require('./config/db')
const fileUpload = require('express-fileupload')

const app = express();

const PORT = 3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(fileUpload())

mongoClient.connect(db.url, (err,  database) => {
    if (err) return console.log('Error occurred')

    // database.
    
    app.use('/api', require('./app/routes/api/index')(express, database.db('text_extraction')))
    // app.use('/web', require('./app/routes/web/index')(express, database))

    // app.get('/hello', (req, res) => {
    //     console.log('hello')
    //     res.send('hello')
    // })
    
    app.listen(PORT, () => console.log('Server Is Live'))

    // database.close()
})