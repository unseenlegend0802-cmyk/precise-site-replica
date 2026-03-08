import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowLeft, Calendar, Clock, Tag, User, Share2 } from "lucide-react";
import { getBlogBySlug, getBlogsByCategory } from "@/data/blogPosts";
import BlogContentRenderer from "@/components/blog/BlogContentRenderer";
import RelatedArticlesSidebar from "@/components/blog/RelatedArticlesSidebar";

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
    .slice(0, 4);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const tags = [post.category, "Nutrition", "Interventional Radiology"].filter(Boolean);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      {/* Back to blog */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>

      {/* Two-column layout */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
            {/* Left: Main content */}
            <div>
              {/* Hero image */}
              <AnimatedSection>
                <div className="rounded-2xl overflow-hidden mb-8">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full aspect-[16/9] object-cover"
                  />
                </div>
              </AnimatedSection>

              {/* Meta row */}
              <AnimatedSection delay={0.05}>
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" /> Medagg Healthcare
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {post.readTime}
                  </span>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors ml-auto"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </AnimatedSection>

              {/* Title */}
              <AnimatedSection delay={0.1}>
                <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-tight mb-5">
                  {post.title}
                </h1>
              </AnimatedSection>

              {/* Tags */}
              <AnimatedSection delay={0.12}>
                <div className="flex flex-wrap gap-2 mb-8">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-muted-foreground border border-border"
                    >
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              </AnimatedSection>

              {/* Article body */}
              <AnimatedSection delay={0.15}>
                <div className="bg-card rounded-2xl border border-border p-6 md:p-10">
                  <p className="text-lg text-foreground/90 leading-relaxed mb-8">
                    {post.excerpt}
                  </p>
                  <BlogContentRenderer content={post.content} date={post.date} />
                </div>
              </AnimatedSection>

              {/* CTA */}
              <AnimatedSection delay={0.2}>
                <div className="bg-pink-gradient rounded-2xl p-8 text-center mt-10">
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

            {/* Right: Related Articles Sidebar */}
            <RelatedArticlesSidebar posts={relatedPosts} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
