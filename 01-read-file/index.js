const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf8');

readStream.on('data', (data) => {
  console.log(data);
})

readStream.on('error', (err) => {
  console.error('Error reading the file:', err.message);
});

readStream.on('end', () => {
  console.log('File reading completed.');
});