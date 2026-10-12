import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/listing-pages";
import { SEED_CATEGORIES } from "@/lib/seed";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_public/category/$slug")({
  head: ({ params }) => {
    const category = SEED_CATEGORIES.find((item) => item.slug === params.slug);
    return pageHead({
      title: `${category?.name ?? "Section"} — Stackwise`,
      description: category?.description ?? "Stories from the Stackwise desk.",
      path: `/category/${params.slug}`,
    });
  },
  component: function CategoryRoute() {
    const { slug } = Route.useParams();
    return <CategoryPage slug={slug} />;
  },
});
