import fs from "node:fs";

export function ensureArrayFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]\n", "utf-8");
        return;
    }

    const raw = fs.readFileSync(filePath, "utf-8").trim();
    if (!raw) {
        fs.writeFileSync(filePath, "[]\n", "utf-8");
    }
}

export function readCollection<T>(filePath: string): T[] {
    ensureArrayFile(filePath);

    const raw = fs.readFileSync(filePath, "utf-8").trim();
    return raw ? (JSON.parse(raw) as T[]) : [];
}

export function writeCollection<T>(filePath: string, value: T[]): void {
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}
