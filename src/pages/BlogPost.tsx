import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { getBlogBySlug, getBlogsByCategory } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogBySlug(slug || "");

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blogs" className="text-primary hover:underline">← Back to Blogs</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedPosts = getBlogsByCategory(post.category)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  // Simple markdown-like renderer
  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={i} className="text-2xl font-bold text-foreground mt-10 mb-4">
            {block.replace("## ", "")}
          </h2>
        );
      }
      if (block.startsWith("### ")) {
        return (
          <h3 key={i} className="text-xl font-semibold text-foreground mt-8 mb-3">
            {block.replace("### ", "")}
          </h3>
        );
      }
      if (block.startsWith("| ")) {
        const rows = block.split("\n").filter((r) => !r.startsWith("|--"));
        const headers = rows[0]?.split("|").filter(Boolean).map((h) => h.trim());
        const dataRows = rows.slice(1);
        return (
          <div key={i} className="overflow-x-auto my-6">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted">
                  {headers?.map((h, j) => (
                    <th key={j} className="px-4 py-3 text-left font-semibold text-foreground border-b border-border">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, ri) => {
                  const cells = row.split("|").filter(Boolean).map((c) => c.trim());
                  return (
                    <tr key={ri} className="border-b border-border last:border-0">
                      {cells.map((cell, ci) => (
                        <td key={ci} className="px-4 py-3 text-muted-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      if (block.startsWith("- ")) {
        const items = block.split("\n").filter((l) => l.startsWith("- "));
        return (
          <ul key={i} className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
            {items.map((item, j) => (
              <li key={j}>{item.replace("- ", "")}</li>
            ))}
          </ul>
        );
      }
      // Bold text handling
      const parts = block.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-muted-foreground leading-relaxed my-4">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="text-foreground font-semibold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative">
        <div className="aspect-[21/9] max-h-[400px] overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative -mt-32 z-10">
          <AnimatedSection>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blogs
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-primary bg-stat px-3 py-1 rounded-full flex items-center gap-1">
                <Tag className="w-3 h-3" /> {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" /> {post.date}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" /> {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground max-w-4xl">
              {post.title}
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="bg-card-gradient rounded-xl border border-border p-6 md:p-10 mb-8">
                <p className="text-lg text-foreground font-medium leading-relaxed italic border-l-4 border-primary pl-4">
                  {post.excerpt}
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <article className="prose-custom">{renderContent(post.content)}</article>
            </AnimatedSection>

            {/* CTA */}
            <AnimatedSection delay={0.2}>
              <div className="bg-pink-gradient rounded-2xl p-8 text-center mt-12">
                <h3 className="text-2xl font-bold text-primary-foreground mb-3">
                  Need Expert Guidance?
                </h3>
                <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
                  Talk to our Care Custodians for personalized treatment recommendations.
                </p>
                <Link
                  to="/contact"
                  className="inline-block bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Book Consultation
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 lg:py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                More in <span className="text-primary">{post.category}</span>
              </h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((rp, i) => (
                <AnimatedSection key={rp.slug} delay={i * 0.1}>
                  <Link
                    to={`/blog/${rp.slug}`}
                    className="group bg-card-gradient rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={rp.image}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {rp.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{rp.excerpt}</p>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPost;
