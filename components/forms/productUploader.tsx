'use client';

import { toast } from "sonner";
import { UploadButton } from "@/lib/utils/uploadthing";

export default function DualImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  return (
    <div className="image-upload-group">
      <h5 style={{ marginBottom: "1rem" }}>Upload up to 2 images</h5>

      <UploadButton
        endpoint="productImage"
        onClientUploadComplete={(res) => {
          if (!res || res.length !== 2) {
            toast.error("You must upload exactly 2 images.");
            return;
          }

          const urls = res.map((r) => r.url);
          onChange(urls);
          toast.success("Images uploaded successfully!");
        }}
        onUploadError={(err: Error) => {
          toast.error(`Upload failed: ${err.message}`);
        }}
      />

      {value.length > 0 && (
        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          {value.map((url, i) => (
            <div key={i}>
              <h5 style={{ marginBottom: "0.25rem" }}>Preview {i + 1}</h5>
              <img
                src={url}
                alt={`Image ${i + 1}`}
                loading="lazy"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
