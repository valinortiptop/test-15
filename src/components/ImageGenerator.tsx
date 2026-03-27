// @ts-nocheck
// src/components/ImageGenerator.tsx
import { useState, useEffect } from "react";
import { Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_base64: string;
  created_at: string;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("generated_images")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(12);
      if (!error && data) setImages(data);
    } catch (e) {
      console.warn("Gallery fetch failed", e);
    } finally {
      setLoadingGallery(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setGenerating(true);
    const tid = toast.loading("Generating with Gemini AI...");
    try {
      const { data, error } = await supabase.functions.invoke("api-handler", {
        body: { action: "generate-image", prompt: prompt.trim() },
      });

      if (error) throw new Error(error.message);

      const raw = data as any;
      if (raw?.error) throw new Error(raw.error);

      const parts: any[] = raw?.candidates?.[0]?.content?.parts ?? [];
      const imgPart = parts.find((p: any) => p?.inlineData?.data);
      if (!imgPart) {
        const reason = raw?.promptFeedback?.blockReason;
        throw new Error(reason ? `Blocked: ${reason}` : "No image returned by AI");
      }

      const { error: dbErr } = await supabase.from("generated_images").insert({
        prompt: prompt.trim(),
        image_base64: imgPart.inlineData.data,
      });
      if (dbErr) throw dbErr;

      toast.success("Image created and saved to gallery!", { id: tid });
      setPrompt("");
      fetchImages();
    } catch (err: any) {
      toast.error(err?.message ?? "Generation failed. Try again.", { id: tid });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="card p-6 sm:p-10 bg-white">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl mb-4">
          <Sparkles className="w-6 h-6 text-brand-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Community AI Gallery</h2>
        <p className="text-gray-500">
          Powered by Gemini 3.1 Flash Image Preview. Type a prompt, generate an image, and share it with everyone.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto mb-10">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A futuristic city in Mexico at sunset, cyberpunk style..."
          className="input-field flex-1"
          disabled={generating}
          required
        />
        <button type="submit" disabled={generating || !prompt.trim()} className="btn-primary whitespace-nowrap">
          {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate</>}
        </button>
      </form>

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-gray-400" /> Recent Creations
        </h3>

        {loadingGallery ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-14 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No images yet — be the first to generate one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(img => (
              <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={`data:image/jpeg;base64,${img.image_base64}`}
                  alt={img.prompt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-white text-xs line-clamp-3">"{img.prompt}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}