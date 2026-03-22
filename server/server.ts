import express, { type NextFunction, type Request, type Response } from "express";
import path from "node:path";

import { CLIENT_ROOT, PORT } from "./src/constants/const";
import { apiRouter } from "./src/router/router";
import { HttpError } from "./src/utils/http-error";

const app = express();

app.use(express.json());
app.use("/api", apiRouter);
app.use("/dist", express.static(path.join(CLIENT_ROOT, "dist")));
app.use("/public", express.static(path.join(CLIENT_ROOT, "public")));

app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(CLIENT_ROOT, "index.html"));
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  const message = error instanceof Error ? error.message : "Внутренняя ошибка сервера";
  res.status(500).json({ message });
});

app.listen(PORT, () => {
  console.log(`L_Shop server started on http://localhost:${PORT}`);
});
