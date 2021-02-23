// const { createWorker } = require('tesseract.js');
const createWorker = require('tesseract.js-node');
const path = require('path');
const fs = require('fs')


module.exports = (express, db) => {
    const router = express.Router()
    router.post('/:lang', async (req, res) => {
        // console.log(req.body)
        try {
            db.collection('langs').find({}).toArray((error, supportedLangs) => {
                console.log(supportedLangs);
                // res.send(supportedLangs.map((lang) => lang['key']))
                if (error) {
                    res.send({error: `An error occurred, Please try again later ${error}`})
                } else {
                    if (supportedLangs.map((lang) => lang['key']).indexOf(req.params.lang) < 0) {
                        res.send({error: 'The select language is not supported'})
                    } else {
                        if (!req.files) {
                            res.send({error: 'No file selected'})
                        } else {
                            var extractedTexts = []
                            console.log(`Supported language keys: ${supportedLangs.map((lang) => lang['key'])}`)
                            const images = req.files['images'] || req.files['images[]']
                            console.log(req.files)
                            console.log(images)
                            // const uploadPath = __dirname+'../../../../../public/images/'+images.name
                            if (images) {
                                images.forEach(async (image, index) => {
                                    const uploadPath = path.join(__dirname, '/../../../../public/images/', image.name)
                    
                                    image.mv(uploadPath, async (err) => {
                                        if (err) {
                                            res.send({error: `An error occurred, while moving file: ${err}`})
                                            // break;
                                        } else {
                                            
                                            const worker = await createWorker({
                                                tessdata: path.join(__dirname, './lang-data'),    // where .traineddata-files are located
                                                languages: supportedLangs.map((lang) => lang['key'])         // languages to load
                                            });
                                            
                                            const text = await worker.recognize(uploadPath, req.params.lang);
                                            console.log(text)
                                            extractedTexts.push({
                                                name: image.name, text
                                            });
                                            fs.unlink(uploadPath, (error) => {
                                                if (error) console.log(`File Delete Error ${error}`)
                                                console.log("File deleted")
                                            })
                                            
                                            if (extractedTexts.length == images.length) {
                                                console.log('Extraction done...')
                                                res.send(extractedTexts)
                                            }
                                            
                                            // const worker = createWorker({
                                            //     langPath: path.join(__dirname, './lang-data'), 
                                            //     logger: m => console.log(m),
                                            //     errorHandler: error => console.log(error),
                                            // });
                                            // (async () => {
                                                //     await worker.load();
                                                //     await worker.setParameters()
                                                //     await worker.loadLanguage(req.params.lang);
                                                //     await worker.initialize(req.params.lang);
                                            //     const { data: { text } } = await worker.recognize(uploadPath);
                                            //     await worker.terminate();
                                            //     console.log(text);
    
                                            //     extractedTexts.push({
                                            //         name: image.name, text
                                            //     });
                                            //     fs.unlink(uploadPath, (error) => {
                                            //         if (error) console.log(`File Delete Error ${error}`)
                                            //         console.log("File deleted")
                                            //     })
        
                                            //     if (index == (images.length - 1)) {
                                            //         console.log('Extraction done...')
                                            //         res.send(extractedTexts)
                                            //     }
                                                
                                            // })();
                                        }
                                    })
                                })
                            } else {
                                res.send({error: 'No image found selected'})
                            }
            
                        }
                    }
                }
            })
        } catch (error) {
            res.send({error:`An error occurred, while extracting text, please try again after some time: ${error}`})
        }
    })
    return router
}