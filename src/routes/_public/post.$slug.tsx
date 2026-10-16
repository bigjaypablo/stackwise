import { createFileRoute } from "@tanstack/react-router";
import { PostPage } from "@/components/post-page";
import { getPostBySlug } from "@/lib/api";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/post/$slug")({
  loader: async ({ params }) => {
    try {
      return { post: await getPostBySlug(params.slug) };
    } catch {
      return { post: null };
    }
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    if (!post) {
      return pageHead({
        title: "Story — Stackwise",
        description: "A Stackwise research post.",
        path: `/post/${params.slug}`,
        type: "article",
        noindex: true,
      });
    }
    return pageHead({
      title: `${post.title} — Stackwise`,
      description: post.summary,
      path: `/post/${post.slug}`,
      type: "article",
      image: post.coverUrl || undefined,
    });
  },
  component: function PostRoute() {
    const { slug } = Route.useParams();
    const { post } = Route.useLoaderData();
    return <PostPage key={slug} slug={slug} initialPost={post} />;
  },
});
