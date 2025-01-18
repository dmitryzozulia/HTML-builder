const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function fileInfo() {
  try {
    const files = (
      await fs.readdir(folderPath, { withFileTypes: true })
    ).filter((file) => file.isFile());

    for (const file of files) {
      const filePath = path.join(folderPath, file.name);
      const stats = await fs.stat(filePath);
      const fileName = path.parse(file.name).name;
      const fileExt = path.extname(file.name).slice(1);
      const fileSize = stats.size / 1024;

      console.log(`${fileName} - ${fileExt} - ${fileSize.toFixed(3)}kb`);
    }
  } catch (err) {
    console.error(err);
  }
}

fileInfo();
