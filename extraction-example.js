const { createWorker } = require('tesseract.js');
const path = require('path');

const worker = createWorker({
  langPath: path.join(__dirname, './', 'lang-data'), 
  logger: m => console.log(m),
  errorHandler: error => console.log(error),
});

(async () => {
  await worker.load();
  await worker.loadLanguage('ara');
  await worker.initialize('ara');
  const { data: { text } } = await worker.recognize(path.join(__dirname, './', 'images', 'test_arab.png'));
  await worker.terminate();
  console.log(text);
})();