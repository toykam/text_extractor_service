const { createWorker } = require('tesseract.js');
const path = require('path');
const fs = require('fs')


module.exports = (express, db) => {
    const router = express.Router()
    router.post('/:lang', async (req, res) => {
        // console.log(req.body)
        try {
            db.collection('langs').findOne({key: req.params.lang}, (error, result) => {
                console.log(result);
                if (error) {
                    res.send({error: `An error occurred, Please try again later ${error}`})
                } else {
                    if (!result) {
                        res.send({error: 'The select language is not supported'})
                    } else {
                        if (!req.files) {
                            res.send({error: 'No file selected'})
                        } else {
                            var extractedTexts = []

                            const images = req.files.images
                            console.log(images)
                            // const uploadPath = __dirname+'../../../../../public/images/'+images.name

                            images.forEach((image, index) => {
                                const uploadPath = path.join(__dirname, '/../../../../public/images/', image.name)
                
                                image.mv(uploadPath, (err) => {
                                    if (err) {
                                        res.send({error: `An error occurred, Please try again later ${err}`})
                                        // break;
                                    } else {
                                        const worker = createWorker({
                                            langPath: path.join(__dirname, './', 'lang-data'), 
                                            logger: m => console.log(m),
                                            errorHandler: error => console.log(error),
                                        });

                                        (async () => {
                                            await worker.load();
                                            await worker.loadLanguage(req.params.lang);
                                            await worker.initialize(req.params.lang);
                                            const { data: { text } } = await worker.recognize(uploadPath);
                                            await worker.terminate();
                                            // console.log(text);
                                            extractedTexts.push({
                                                name: image.name, text
                                            });
                                            // path: uploadPath,
                                            // fs.rmSync(uploadPath)
                                            fs.unlink(uploadPath, () => {
                                                console.log("File deleted")
                                            })
                                            if (images.length == extractedTexts.length) {
                                                console.log('Extraction done...')
                                                res.send(extractedTexts)
                                            }
                                        })();
                                    }
                                })
                            })
            
                        }
                    }
                }
            })
        } catch (error) {
            res.send(`An error occurred, while extracting text, please try again after some time: ${error}`)
        }
    })
    return router
}