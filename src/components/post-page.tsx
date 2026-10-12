import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AffiliateLink } from "@/components/affiliate-link";
import { Cover } from "@/components/cover";
import { MarkdownBody } from "@/components/markdown-body";
import { StoryCard } from "@/components/story-card";
import { TimeAgo } from "@/components/time-ago";
import { getPostBySlug } from "@/lib/api";
import { articleJsonLd, jsonLdScript } from "@/lib/seo";
import { affiliateById, categoryById, usePublicData } from "@/lib/use-public";
import { findSeedPost } from "@/lib/seed";
import type { Post } from "@/lib/types";

export function PostPage({ slug }: { slug: string }) {
  const data = usePublicData();
  const seeded = findSeedPost(slug) ?? null;
  const [post, setPost] = useState<Post | null>(seeded);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancel = false;
    getPostBySlug(slug)
      .then((next) => {
        if (cancel) return;
        setPost(next);
        setMissing(!next);
      })
      .catch(() => {
        if (!cancel) setMissing(true);
      });
    return () => {
      cancel = true;
    };
  }, [slug]);

  if (!post) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl font-extrabold">{missing ? "That story is not published" : "Loading story"}</h1>
        <p className="mt-3 text-ink/70">{missing ? "It may be a draft, or the link is old." : "One moment."}</p>
        <Link to="/" className="mt-6 inline-flex h-11 items-center font-semibold text-accent">
          Back home
        </Link>
      </div>
    );
  }

  const category = categoryById(data.categories, post.categoryId);
  const affiliate = affiliateById(data.affiliates, post.affiliateId);
  const related = data.posts.filter((item) => item.categoryId === post.categoryId && item.id !== post.id).slice(0, 3);
  const ld = articleJsonLd({
    title: post.title,
    description: post.summary,
    path: `/post/${post.slug}`,
    publishedAt: post.publishedAt || post.createdAt,
    updatedAt: post.updatedAt,
    authorName: post.authorName,
  });

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(ld) }} />
      <p className="text-xs font-bold uppercase tracking-wide text-accent">{category?.name}</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">{post.title}</h1>
      <p className="mt-4 text-sm text-ink/65">
        {post.authorName} · <TimeAgo iso={post.publishedAt || post.updatedAt} /> · {post.readMinutes} min read
      </p>
      <Cover title={post.title} url={post.coverUrl} category={category} className="mt-6 aspect-[16/8] w-full rounded-3xl" />
      <p className="mt-6 max-w-3xl text-lg text-ink/80">{post.summary}</p>
      <div className="mt-2 max-w-3xl">
        <MarkdownBody source={post.body} affiliates={data.affiliates} />
      </div>
      {affiliate ? (
        <aside className="mt-8 max-w-3xl rounded-3xl bg-ink p-5 text-paper sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-accent">Our pick</p>
          <h2 className="mt-2 text-2xl font-extrabold">{affiliate.name}</h2>
          <p className="mt-2 max-w-xl text-sm text-paper/75">
            If you use this link, Stackwise may earn a commission. It does not change what we wrote, and you should still read the notes above.
          </p>
          <AffiliateLink
            affiliate={affiliate}
            className="mt-4 inline-flex h-11 items-center rounded-full bg-accent px-4 text-sm font-semibold text-paper"
          >
            Visit {affiliate.name}
          </AffiliateLink>
          <p className="mt-3 text-xs text-paper/50">Contains affiliate links</p>
        </aside>
      ) : null}
      {related.length ? (
        <section className="mt-10" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-extrabold">
            Related
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <StoryCard key={item.id} post={item} category={categoryById(data.categories, item.categoryId)} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
