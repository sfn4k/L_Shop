import express from "express";
import path from "node:path";

import { Client_path, Port } from "../constants/const";
import router from "../router/router";

const app = express();

app.use(express.json());
app.use("/api", router);
app.use("/dist", express.static(path.join(Client_path, "dist")));
app.use("/public", express.static(path.join(Client_path, "public")));

app.use((req, res) => {
    const isApiRoute = req.path.startsWith("/api/");

    if (isApiRoute) {
        res.status(404).json({ message: "Маршрут не найден" });
        return;
    }

    res.sendFile(path.join(Client_path, "index.html"));
});

app.listen(Port, () => {
    console.log("Server started on port 3000");
});
