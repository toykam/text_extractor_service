const { createWorker } = require('tesseract.js');
const path = require('path');


module.exports = (express, db) => {
    const router = express.Router()
    router.post('/:lang', async (req, res) => {
        try {
            if (!req.files) {
                res.send({error: 'No file selected'})
            } else {
                const imageData = req.files.image
                const uploadPath = __dirname+'../../../../../public/images/'+imageData.name

                imageData.mv(uploadPath, (err) => {
                    if (err) {
                        res.send({error: `An error occurred, Please try again later ${err}`})
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
                            console.log(text);
                            res.send({
                                name: imageData.name, path: uploadPath, text
                            })
                        })();
                        
                    }
                })

            }
        } catch {
            res.send('An error occurred, while extracting text, please try again after some time')
        }
    })
    return router
}