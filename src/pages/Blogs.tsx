import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { blogPosts, blogCategories, getBlogsByCategory } from "@/data/blogPosts";

const Blogs = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    let posts = getBlogsByCategory(activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return posts;
  }, [activeCategory, searchQuery]);

  // Group posts by category for display
  const groupedPosts = useMemo(() => {
    if (activeCategory !== "All") {
      return [{ category: activeCategory, posts: filteredPosts }];
    }
    const groups: { category: string; posts: typeof filteredPosts }[] = [];
    const seen = new Set<string>();
    filteredPosts.forEach((p) => {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        groups.push({
          category: p.category,
          posts: filteredPosts.filter((fp) => fp.category === p.category),
        });
      }
    });
    return groups;
  }, [activeCategory, filteredPosts]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Simplifying Advanced Healthcare <span className="text-primary">for You.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay informed with the latest medical insights, treatment updates, and health tips from our expert team.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="py-8 bg-secondary border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-4 max-w-5xl mx-auto">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search treatments, problems, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-card text-foreground border border-border focus:border-primary focus:outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
            {/* Filter dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Filter by Topic</span>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-card text-foreground border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none"
              >
                {blogCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category pills (desktop) */}
          <div className="hidden md:flex flex-wrap gap-2 mt-5 max-w-5xl mx-auto">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border hover:border-primary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Groups */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          {groupedPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No articles found matching your search.</p>
            </div>
          )}

          {groupedPosts.map((group) => (
            <div key={group.category} className="mb-14 last:mb-0">
              <AnimatedSection>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-8 bg-primary rounded-full" />
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">{group.category}</h2>
                </div>
              </AnimatedSection>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.posts.map((post, i) => (
                  <AnimatedSection key={post.slug} delay={i * 0.08}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group bg-card-gradient rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read More <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;
