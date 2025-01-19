const fs = require('fs');
const path = require('path');

async function buildCSSBundle() {
  const stylesFolder = path.join(__dirname, 'styles');
  const outputFolder = path.join(__dirname, 'project-dist');
  const outputFile = path.join(outputFolder, 'bundle.css');

  try {
    await fs.promises.mkdir(outputFolder, { recursive: true });
    const files = (
      await fs.promises.readdir(stylesFolder, { withFileTypes: true })
    ).filter((file) => file.isFile() && path.extname(file.name) === '.css');

    const writeSteam = fs.createWriteStream(outputFile);

    for (const file of files) {
      const filePath = path.join(stylesFolder, file.name);
      const data = await fs.promises.readFile(filePath, 'utf-8');
      writeSteam.write(data + '\n');
    }

    writeSteam.end();
  } catch (err) {
    console.log(err);
  }
}

buildCSSBundle();
