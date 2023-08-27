import express from "express";
import { promises as fsPromises } from "fs"; // Use promises from fs
import { Request, Response } from "express";
import fileReader from "../utils/file-reader";
import slugify from "../utils/slugify";
import { BlogPost } from "entities/blog-post";

const router = express.Router();

/**
 * Handles GET requests to retrieve a specific blog post by its slug.
 * Responds with JSON containing the requested blog post content and associated metadata.
 *
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 */
router.get("/blog/:post", async (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { params } = req;
  const postSlug = params.post;

  try {
    // Read the list of files in the blog pages directory using fsPromises
    const files = await fsPromises.readdir("./dist/blog-client/app/pages", "utf8");
    const data = await fileReader(files);

    const fileArr: { file: string; content: string; slug?: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const fileObj = {
        file: files[i],
        content: data[i],
      };
      fileArr.push(fileObj);
    }

    // Read and parse blog metadata from blog.json
    const metadataBuffer = await fsPromises.readFile("./dist/blog-client/assets/blog.json", "utf8");
    const metadata = JSON.parse(metadataBuffer);

    // Check if the number of files matches the metadata count
    if (metadata.length === fileArr.length) {
      // Associate slugs with corresponding metadata using for...of loop
      for (const f of fileArr) {
        const metadataMatch = metadata.find((meta: BlogPost) => f.file === meta.template);
        if (metadataMatch) {
          f.slug = slugify(metadataMatch.title);
        }
      }

      // Find the requested post by its slug
      const post = fileArr.find((f) => f.slug === postSlug);

      if (post) {
        // Find corresponding metadata for the requested post
        const postMetaData = metadata.find((meta: BlogPost) => slugify(meta.title) === post.slug);
        // Respond with the post content and metadata
        res.status(200).json({ post, metadata: postMetaData });
      } else {
        // Respond with an error if the post doesn't exist
        res.json({ status: "FAILED", message: "That post slug doesn't exist." });
      }
    } else {
      // Log a message if the metadata count doesn't match
      console.log("Don't forget to update `blog.json` when you add new articles to the `/pages` directory.");
    }
  } catch (err) {
    // Respond with an error if file reading fails
    res.status(400).json({ status: "FAILED", message: "Failed to read files.", err: err });
  }
});

export = router;
