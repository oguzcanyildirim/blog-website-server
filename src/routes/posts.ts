import express from "express";
import fs from "fs";
import { Request, Response } from "express";
import slugify from "../utils/slugify";
import { BlogPost } from "entities/blog-post";

const router = express.Router();

router.get("/recent", (req: Request, res: Response) => {
  let metadata: BlogPost[];

  fs.readFile(`./dist/blog-client/assets/blog.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    metadata = JSON.parse(data);
    metadata.forEach((post: BlogPost) => {
      post.slug = slugify(post.title);
      post.date = new Date(post.date).toISOString();;
    });
    const recent = metadata
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
    res.status(200).json(recent);
  });
});

router.get("/blog", (req: Request, res: Response) => {
  fs.readFile(`./dist/blog-client/assets/blog.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const metadata: BlogPost[] = JSON.parse(data);
    res.status(200).json(metadata);
  });
});

export = router;
