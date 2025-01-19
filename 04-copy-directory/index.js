const fs = require('fs');
const path = require('path');

async function copyDir(src, dest) {
  try {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });
    const destEntries = await fs.promises.readdir(dest);
    await Promise.all(
      destEntries.map((entry) =>
        fs.promises.rm(path.join(dest, entry), {
          recursive: true,
          force: true,
        }),
      ),
    );
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else if (entry.isFile()) {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

const srcFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');

copyDir(srcFolder, destFolder);
