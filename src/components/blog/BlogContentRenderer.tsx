import { Share2 } from "lucide-react";

interface Props {
  content: string;
  date?: string;
}

const BlogContentRenderer = ({ content, date }: Props) => {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: document.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div>
      <article className="space-y-1">
    <article className="space-y-1">
      {content.split("\n\n").map((block, i) => {
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
                          <td key={ci} className="px-4 py-3 text-muted-foreground">{cell}</td>
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
                <strong key={j} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        );
      })}
      </article>

      {/* Bottom bar: Published date + Share */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <span className="text-sm text-muted-foreground">
          Published: {date || ""}
        </span>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Share2 className="w-4 h-4" /> Share Article
        </button>
      </div>
    </div>
  );
};

export default BlogContentRenderer;
