// @ts-nocheck
// src/components/ImageGenerator.tsx
import { useState } from "react";
import { Sparkles, Loader2, ImageIcon, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_base64: string;
  created_at: string;
}

function extractBase64(data: any): string {
  try {
    const parts = data?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return "";
    for (const part of parts) {
      if (part && part.inlineData && part.inlineData.data) {
        return part.inlineData.data as string;
      }
    }
    return "";
  } catch {
    return "";
  }
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("api-handler", {
        body: {
          action: "generate-image",
          prompt: trimmed,
        },
      });

      if (fnError) throw new Error(fnError.message);

      const resData = data as any;
      const base64 = extractBase64(resData);

      if (!base64) {
        throw new Error("No image data returned from API.");
      }

      const { data: dbRow, error: dbError } = await supabase
        .from("generated_images")
        .insert({ prompt: trimmed, image_base64: base64 })
        .select()
        .single();

      if (dbError) {
        console.warn("DB insert failed, showing image without saving:", dbError);
        const tempImage: GeneratedImage = {
          id: Date.now().toString(),
          prompt: trimmed,
          image_base64: base64,
          created_at: new Date().toISOString(),
        };
        setImages((prev) => [tempImage, ...prev]);
      } else {
        setImages((prev) => [dbRow as GeneratedImage, ...prev]);
      }

      setPrompt("");
    } catch (err: any) {
      console.error("Image generation error:", err);
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) handleGenerate();
  };

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">AI Image Generator</h3>
          <p className="text-sm text-gray-500">Describe an image and watch it come to life</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="A futuristic city at sunset..."
          disabled={loading}
          className="input-field flex-1"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="btn-primary flex-shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span className="ml-2 hidden sm:inline">
            {loading ? "Generating..." : "Generate"}
          </span>
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-brand-400 animate-pulse" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Creating your image...</p>
          <p className="text-xs text-gray-400">This may take 10-20 seconds</p>
        </div>
      )}

      {!loading && images.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 border-2 border-dashed border-gray-200 rounded-xl">
          <ImageIcon className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-400 font-medium">Your generated images will appear here</p>
          <p className="text-xs text-gray-300">Try: A serene mountain lake at dawn</p>
        </div>
      )}

      {!loading && images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <img
                src={"data:image/png;base64," + img.image_base64}
                alt={img.prompt}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-medium line-clamp-2">{img.prompt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}