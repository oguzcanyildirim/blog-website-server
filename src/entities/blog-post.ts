export interface BlogPost {
    id: number;
    title: string;
    slug: string; // TODO: make it optional
    date: string;
    preview: string;
    tags: string[];
    template: string;
    author: string;
    categories: string[];
    thumbnail: string;   
    content: string;
  }
  