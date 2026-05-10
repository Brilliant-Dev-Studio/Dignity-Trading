export type AdminCreateBlogRequest = {
  title: string;
  subtitle?: string;
  author?: string;
  coverUrl?: string;
  tags?: string;
  contentHtml?: string;
  contentText?: string;
  category?: string;
  status?: "DRAFT" | "REVIEW" | "PUBLISHED";
};

export type AdminPatchBlogRequest = {
  title?: string;
  subtitle?: string;
  author?: string;
  coverUrl?: string;
  tags?: string;
  contentHtml?: string;
  contentText?: string;
  category?: string;
  status?: "DRAFT" | "REVIEW" | "PUBLISHED";
};

