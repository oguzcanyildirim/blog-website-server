import express from 'express';
import { Request, Response } from 'express';
import { slugify } from '../utils/slugify';
import { BlogPost } from '../entities/blog-post';
import { readFileContent } from '../utils/file-reader';
import { getStaticFileLocation } from '../utils/get-static-file-location';

const router = express.Router();

router.get('/recentPosts', async (req: Request, res: Response) => {
  try {
    const metadata: BlogPost[] = await readFileContent(getStaticFileLocation());

    metadata.forEach((post: BlogPost) => {
      post.slug = slugify(post.title);
      post.date = new Date(post.date).toISOString();
    });

    const recent = metadata
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    res.status(200).json(recent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read blog posts' });
  }
});

router.get('/postsMetadata', async (req: Request, res: Response) => {
  try {
    const metadata: BlogPost[] = await readFileContent(getStaticFileLocation());
    res.status(200).json(metadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read blog posts' });
  }
});

export = router;
