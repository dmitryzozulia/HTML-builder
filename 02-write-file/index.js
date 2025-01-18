const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log(
  'Welcome! Please enter some text to save to the file. Type "exit" or press Ctrl+C to quit.',
);

process.stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input.toLowerCase() === 'exit') {
    console.log('Goodbye, thank you for using the program.');
    process.exit();
  }
  writeStream.write(input + '\n', (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

process.on('SIGINT', () => {
  console.log('\nGoodbye! Thank you for using the program.');
  process.exit();
});
