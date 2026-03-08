import { Link } from "react-router-dom";
import type { BlogPost } from "@/data/blogPosts";

interface Props {
  posts: BlogPost[];
}

const RelatedArticlesSidebar = ({ posts }: Props) => {
  if (posts.length === 0) return null;

  return (
    <aside className="lg:sticky lg:top-24">
      <h2 className="text-xl font-bold text-foreground mb-6">Related Articles</h2>
      <div className="flex flex-col gap-5">
        {posts.map((rp) => (
          <Link
            key={rp.slug}
            to={`/blog/${rp.slug}`}
            className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={rp.image}
                alt={rp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {rp.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5">{rp.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default RelatedArticlesSidebar;
