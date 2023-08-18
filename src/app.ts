import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import serverless from "serverless-http";
import { Request, Response, NextFunction } from "express";
import fs from "fs";

const app = express();
const router = express.Router();

app.use(
  cors({
    optionsSuccessStatus: 200,
    origin: "http://localhost:4200",
  })
);
app.options("*", cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// specify the mount path for the static directory `/dist`
app.use("/", express.static("dist"));

import postRouter from "./routes/post";
import postsRouter from "./routes/posts";
import getPostByTagRouter from "./routes/get-post-by-tag";

// Set Netlify function routes
app.use("/.netlify/functions/app", postRouter);
app.use("/.netlify/functions/app", postsRouter);
app.use("/.netlify/functions/app", getPostByTagRouter);

// accessed at /.netlify/functions/app/test
router.get("/test", (req: Request, res: Response) => {
  res.json({ hey: "you" });
});

// Local Dev
//app.use("/", router);

// Netlify Lambda function route - for production
app.use("/.netlify/functions/app", router);

export = app;
module.exports.handler = serverless(app);
