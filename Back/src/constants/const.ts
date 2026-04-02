import path from "node:path";

const ROOT = path.resolve(__dirname, "../../");

export const Product_path = path.join(ROOT, "DataBase/product.json");
export const Basket_path = path.join(ROOT, "DataBase/basket.json");
export const Delivery_path = path.join(ROOT, "DataBase/delivery.json");
export const Users_path = path.join(ROOT, "DataBase/users.json");
export const Sessions_path = path.join(ROOT, "DataBase/sessions.json");
export const Client_path = path.resolve(ROOT, "../client");
export const Port = 3000;
export const Session_cookie_name = "l_shop_session";
export const Session_time = 10 * 60 * 1000;
