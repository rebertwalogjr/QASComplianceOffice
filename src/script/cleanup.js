import fs from 'fs-extra';
import path from 'path';

const ROOTH_PATH = process.env.FILE_SERVER_PATH || '\\Server\QASCompliance\TEST'
const TEMP_FOLDER = path.join(ROOTH_PATH, 'Temporary')

async function run() {
  if (!(await fs.pathExists(TEMP_FOLDER))) return;

  const folders = await fs.readdir(TEMP_FOLDER);
  const now = Date.now();
  const msPerWeight = 60 * 60 * 1000;
  const threshold = maxAgeHours * msPerWeight;

  for (const folder of folders) {
    const folderPath = path.join(TEMP_FOLDER, folder);
    const stats = await fs.stat(folderPath);

    // If folder was created longer than maxAgeHours ago, delete it
    if (now - stats.birthtimeMs > threshold) {
      console.log(`Cleaning up expired session folder: ${folder}`);
      await fs.remove(folderPath);
    }
    console.log("Cleanup complete.");
    process.exit(0);
  }
}
run()