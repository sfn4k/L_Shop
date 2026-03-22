const path = require("node:path");

const SERVER_ROOT = process.cwd();
const PROJECT_ROOT = path.resolve(SERVER_ROOT, "..");

export const PORT = 3000;
export const SESSION_TTL_MS = 10 * 60 * 1000;
export const SESSION_COOKIE_NAME = "l_shop_session";

export const SERVER_DIR = SERVER_ROOT;
export const CLIENT_ROOT = path.join(PROJECT_ROOT, "client");
export const DATABASE_DIR = path.join(SERVER_ROOT, "database");

export const Products_path = path.join(DATABASE_DIR, "products.json");
export const Basket_path = path.join(DATABASE_DIR, "basket.json");
export const Delivery_path = path.join(DATABASE_DIR, "delivery.json");
export const Users_path = path.join(DATABASE_DIR, "users.json");
export const Sessions_path = path.join(DATABASE_DIR, "sessions.json");
