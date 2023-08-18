import express from "express";
import fs from "fs";
import { Request, Response } from "express";
import { BlogPost } from "entities/blog-post";

const router = express.Router();

router.get("/blog/topics/:tag", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { params } = req;
  const tag = params.tag;
  let postData: BlogPost[]; // Define the type of 'postData'

  fs.readFile(`./dist/blog-client/assets/blog.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    postData = JSON.parse(data).filter((p: BlogPost) => {
      return p.tags.includes(tag);
    });
    if (postData.length !== 0) {
      res.status(200).json(postData);
    } else {
      res.json({ status: "FAILED", message: `Unable to find posts with tag: ${tag}` });
    }
  });
});

export = router;
