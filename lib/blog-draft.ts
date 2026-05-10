export const BLOG_DRAFT_STORAGE_KEY = "dignity-admin-blog-draft";

export type BlogDraft = {
  title: string;
  subtitle: string;
  author: string;
  coverUrl: string;
  tags: string;
  contentHtml: string;
  contentText: string;
  category?: string;
  /** When set, saves publish to this post instead of creating a new one */
  postId?: string;
};
