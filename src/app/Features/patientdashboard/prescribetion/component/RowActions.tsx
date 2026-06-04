import { Download, Eye } from "lucide-react";

export default function RowActions({ pdfUrl }: { pdfUrl: string }) {
  const handleView = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.target = "_blank";
      link.download = pdfUrl.split("/").pop() || "prescription.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex justify-end gap-1">
      <button
        onClick={handleView}
        title="View Details"
        className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
      >
        <Eye size={18} />
      </button>
      <button
        onClick={handleDownload}
        title="Download PDF"
        className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
      >
        <Download size={18} />
      </button>
    </div>
  );
}
