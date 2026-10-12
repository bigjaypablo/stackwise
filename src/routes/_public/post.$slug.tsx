import { createFileRoute } from "@tanstack/react-router";
import { PostPage } from "@/components/post-page";
import { findSeedPost } from "@/lib/seed";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/post/$slug")({
  head: ({ params }) => {
    const post = findSeedPost(params.slug);
    if (!post) {
      return pageHead({
        title: "Story — Stackwise",
        description: "A Stackwise review, comparison, or guide.",
        path: `/post/${params.slug}`,
        type: "article",
      });
    }
    return pageHead({
      title: `${post.title} — Stackwise`,
      description: post.summary,
      path: `/post/${post.slug}`,
      type: "article",
    });
  },
  component: function PostRoute() {
    const { slug } = Route.useParams();
    return <PostPage slug={slug} />;
  },
});
