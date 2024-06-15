import express from 'express';
import { promises as fsPromises } from 'fs';
import { Request, Response } from 'express';
import { getAllFilesFromDirectory, readFileContent, readMultipleFiles } from '../utils/file-reader';
import { slugify } from '../utils/slugify';
import { BlogPost } from '../entities/blog-post';
import { getFilesDirectory, getStaticFileLocation } from '../utils/get-static-file-location';

const router = express.Router();

router.get('/post', async (req: Request, res: Response) => {
    res.header('Access-Control-Allow-Origin', '*');
    const postSlug = req.query.name as string;

  try {
    // Read the list of files in the blog pages directory
    const files = await getAllFilesFromDirectory(getFilesDirectory());
    const filePaths = files.map(file => `${getFilesDirectory()}/${file}`);
    const data = await readMultipleFiles(filePaths);

    const fileArr: { file: string; content: string; slug?: string }[] = [];
    for (let iFile = 0; iFile < files.length; iFile++) {
      const fileObj = {
        file: files[iFile],
        content: data[iFile],
      };
      fileArr.push(fileObj);
    }

    // Read and parse blog metadata from blog.json
    const metadata: BlogPost[] = await readFileContent(getStaticFileLocation());

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
        res.json({ status: 'FAILED', message: "That post slug doesn't exist." });
      }
    } else {
      // Log a message if the metadata count doesn't match
      console.log("Don't forget to update `blog.json` when you add new articles to the `/pages` directory.");
    }
  } catch (err) {
    // Respond with an error if file reading fails
    res.status(400).json({ status: 'FAILED', message: 'Failed to read files.', err: err });
  }
});

export = router;
