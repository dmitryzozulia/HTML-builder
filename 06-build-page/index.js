const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const outputHTML = path.join(projectDist, 'index.html');
const outputCSS = path.join(projectDist, 'style.css');
const outputAssets = path.join(projectDist, 'assets');

async function createProjectDist() {
  await fs.promises.mkdir(projectDist, { recursive: true });
}

async function buildHTML() {
  let template = await fs.promises.readFile(templatePath, 'utf-8');
  const tags = template.match(/{{\s*[\w-]+\s*}}/g) || [];

  for (const tag of tags) {
    const componentName = tag.replace(/{{\s*|\s*}}/g, '');
    const componentPath = path.join(componentsPath, `${componentName}.html`);

    try {
      const componentContent = await fs.promises.readFile(
        componentPath,
        'utf-8',
      );
      template = template.replace(new RegExp(tag, 'g'), componentContent);
    } catch (err) {
      console.error(err);
    }
  }

  await fs.promises.writeFile(outputHTML, template);
  console.log('index.html has been built.');
}

async function buildCSSBundle() {
  try {
    await fs.promises.mkdir(projectDist, { recursive: true });
    const files = (
      await fs.promises.readdir(stylesPath, { withFileTypes: true })
    ).filter((file) => file.isFile() && path.extname(file.name) === '.css');

    const writeSteam = fs.createWriteStream(outputCSS);

    for (const file of files) {
      const filePath = path.join(stylesPath, file.name);
      const data = await fs.promises.readFile(filePath, 'utf-8');
      writeSteam.write(data + '\n');
    }

    writeSteam.end();
  } catch (err) {
    console.error(err);
  }
  console.log('style.css has been built.');
}

async function copyAssets(src, dest) {
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
        await copyAssets(srcPath, destPath);
      } else if (entry.isFile()) {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function buildPage() {
  try {
    await createProjectDist();
    await Promise.all([
      buildHTML(),
      buildCSSBundle(),
      copyAssets(assetsPath, outputAssets),
    ]);
    console.log('Project built successfully.');
  } catch (err) {
    console.error(err);
  }
}

buildPage();
