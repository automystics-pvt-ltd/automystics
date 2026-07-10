import path from "node:path";
import fs from "node:fs";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";
import router from "./routes";
import { logger } from "./lib/logger";
import { ensureDefaultAdmin } from "./lib/seed-admin";
import { ensureDefaultProducts } from "./lib/seed-products";

const app: Express = express();

app.set("trust proxy", true);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PgStore = connectPgSimple(session);

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

app.use(
  session({
    store: new PgStore({ pool, createTableIfMissing: true, tableName: "user_sessions" }),
    secret: process.env.SESSION_SECRET,
    name: "automystics.sid",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

app.use("/api", router);

const staticDir =
  process.env.STATIC_DIR ??
  path.resolve(process.cwd(), "artifacts/automystics/dist/public");

if (fs.existsSync(staticDir)) {
  logger.info({ staticDir }, "Serving static frontend");
  app.use(
    express.static(staticDir, {
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "no-cache");
        }
      },
    }),
  );

  app.get(/^\/(?!api\/).*/, (_req, res, next) => {
    const indexFile = path.join(staticDir, "index.html");
    if (!fs.existsSync(indexFile)) return next();
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(indexFile);
  });
} else {
  logger.warn({ staticDir }, "Static frontend dir not found; skipping SPA serving");
}

void ensureDefaultAdmin();
void ensureDefaultProducts();

export default app;
