import express from 'express';
import { Request, Response } from 'express';
import { BlogPost } from '../entities/blog-post';
import { readFileContent } from '../utils/file-reader';
import { getStaticFileLocation } from '../utils/get-static-file-location';

const router = express.Router();

router.get('/blog/topics/:tag', async (req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', '*');
  const { tag } = req.params;

  try {
    const postData: BlogPost[] = await readFileContent(getStaticFileLocation());
    const filteredPosts = postData.filter((p: BlogPost) => p.tags.includes(tag));

    if (filteredPosts.length !== 0) {
      res.status(200).json(filteredPosts);
    } else {
      res.status(404).json({ status: 'FAILED', message: `Unable to find posts with tag: ${tag}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read blog posts' });
  }
});

export = router;
