import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogs = [
  {
    title: "Understanding Interventional Radiology: A Complete Guide",
    excerpt: "Interventional radiology uses advanced imaging to perform minimally invasive procedures. Learn how these treatments are changing the future of medicine.",
    date: "Jan 15, 2025",
    readTime: "5 min read",
    category: "Education",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
  },
  {
    title: "Uterine Fibroid Embolization: Why Surgery Isn't Always the Answer",
    excerpt: "Millions of women suffer from uterine fibroids. Discover how UFE offers a safe, non-surgical alternative with faster recovery and fewer complications.",
    date: "Feb 3, 2025",
    readTime: "4 min read",
    category: "Treatments",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop",
  },
  {
    title: "Varicose Veins: Causes, Symptoms & Non-Surgical Treatment Options",
    excerpt: "Varicose veins affect 30% of adults. Learn the causes, risk factors, and modern non-surgical treatments available through interventional radiology.",
    date: "Feb 20, 2025",
    readTime: "6 min read",
    category: "Treatments",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&h=400&fit=crop",
  },
  {
    title: "The Role of Care Custodians in Your Treatment Journey",
    excerpt: "A Care Custodian is your personal healthcare navigator. From consultations to recovery, here's how they simplify your medical journey.",
    date: "Mar 5, 2025",
    readTime: "3 min read",
    category: "Services",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
  },
  {
    title: "Prostate Artery Embolization: A Non-Surgical BPH Solution",
    excerpt: "PAE is emerging as a safe alternative to surgery for enlarged prostate. Understand the procedure, benefits, and what to expect during recovery.",
    date: "Mar 18, 2025",
    readTime: "5 min read",
    category: "Treatments",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&h=400&fit=crop",
  },
  {
    title: "How Medagg is Revolutionizing Healthcare Across India",
    excerpt: "From 1 city to 20+, Medagg's journey in building India's largest interventional radiology network is transforming how patients access care.",
    date: "Apr 1, 2025",
    readTime: "4 min read",
    category: "Company",
    image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&h=400&fit=crop",
  },
];

const Blogs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Health <span className="text-primary">Insights</span> & Blogs
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay informed with the latest in non-surgical treatments, patient stories, and healthcare innovations.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <article className="bg-card-gradient rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 group h-full flex flex-col">
                  <div className="aspect-[3/2] overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-medium text-primary bg-stat px-3 py-1 rounded-full w-fit mb-3">
                      {blog.category}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{blog.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{blog.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;
