import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(scriptDir, "..");
const sourceDir = path.join(clientDir, "images");
const targetDir = path.join(clientDir, "dist", "images");

await mkdir(targetDir, { recursive: true });

const entries = await readdir(sourceDir, { withFileTypes: true });
let copiedFiles = 0;

for (const entry of entries) {
    if (!entry.isFile()) {
        continue;
    }

    await copyFile(path.join(sourceDir, entry.name), path.join(targetDir, entry.name));
    copiedFiles += 1;
}

console.log(`Copied ${copiedFiles} images to ${targetDir}`);
