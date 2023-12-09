import express from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import { Request, Response } from "express";


import postRouter from "./routes/post";
import postsRouter from "./routes/posts";
import getPostByTagRouter from "./routes/get-post-by-tag";

const app = express();
const router = express.Router();

app.use(
  cors({
    optionsSuccessStatus: 200,
    origin: "http://localhost:4200",
  })
);

app.use(
  cors({
    origin: "*",
  } as CorsOptions)
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// specify the mount path for the static directory `/dist`
app.use("/", express.static("dist"));

// TODO: change this to your desired route paths
app.use("/api", postRouter);  
app.use("/api", postsRouter);
app.use("/api", getPostByTagRouter);

// Example route for testing
router.get("/test", (req: Request, res: Response) => {
  res.json({ hey: "you" });
});

// If you want to use the express app directly
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
