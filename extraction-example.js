const { createWorker } = require('tesseract.js');
const path = require('path');


const worker = createWorker({
  langPath: path.join(__dirname, '/', 'lang-data'), 
  logger: m => console.log(m),
  errorHandler: error => console.log(error),
});

(async () => {
  await worker.load();
  await worker.loadLanguage(lang);
  await worker.initialize(lang);
  const { data: { text } } = await worker.recognize(imagePath);
  await worker.terminate();
  console.log(text);
  return text;
})();