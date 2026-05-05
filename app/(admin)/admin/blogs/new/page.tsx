import { redirect } from "next/navigation";

export default function CreateBlogPage() {
  redirect("/admin/blogs/new/details");
}
