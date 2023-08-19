import express from "express";
import fs from "fs";
import { Request, Response } from "express";
import fileReader from "../utils/file-reader";
import slugify from "../utils/slugify";
import { BlogPost } from "entities/blog-post";

const router = express.Router();

router.get("/blog/:post", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { params } = req;
  const postSlug = params.post;

  fs.readdir("./dist/blog-client/app/pages", "utf8", (err, files) => {
    if (err) {
      console.error(err);
      res.status(400).json({ status: "FAILED", message: "Unable to read files." });
      return;
    }

    fileReader(files).then((data: string[]) => {
        const fileArr: { file: string; content: string; slug?: string }[] = [];
        files.forEach((f, i) => {
          const fileObj = {
            file: f,
            content: data[i]
          };
          fileArr.push(fileObj);
        });

        if (fileArr.length === 0) {
          res.status(400).json({ status: "FAILED", message: "Unable to read files." });
        } else {
          fs.readFile(`./dist/blog-client/assets/blog.json`, "utf8", (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            const metadata = JSON.parse(data);

            if (metadata.length === fileArr.length) {
              for (let i = 0; i < metadata.length; i++) {
                fileArr.map(f => {
                  if (f.file === metadata[i].template) {
                    f.slug = slugify(metadata[i].title);
                  }
                });
              }

              const post = fileArr.find(f => f.slug === postSlug);

              if (post) {
                const postMetaData = metadata.find((f: BlogPost) => slugify(f.title) === post.slug);
                res.status(200).json({ post, metadata: postMetaData });
              } else {
                res.json({ status: "FAILED", message: "That post slug doesn't exist." });
              }
            } else {
              console.log("Don't forget to update `blog.json` when you add new articles to the `/pages` directory.");
            }
          });
        }
      })
      .catch(err => { res.status(400).json({ status: "FAILED", message: "Failed to read files.", err: err });
      });
  });
});

export = router;
