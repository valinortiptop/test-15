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
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("generated_images")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) throw error;
      if (data) setImages(data);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    const toastId = toast.loading("Generating masterpiece with Gemini AI...");

    try {
      const { data, error } = await supabase.functions.invoke("api-handler", {
        body: { action: "generate-image", prompt: prompt.trim() },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      // Extract base64 from Gemini response
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: any) => p.inlineData);

      if (!imagePart || !imagePart.inlineData.data) {
        throw new Error("No image data received from AI model");
      }

      const base64Data = imagePart.inlineData.data;

      // Save to database
      const { error: dbError } = await supabase.from("generated_images").insert({
        prompt: prompt.trim(),
        image_base64: base64Data,
      });

      if (dbError) throw dbError;

      toast.success("Image generated and added to gallery!", { id: toastId });
      setPrompt("");
      fetchImages(); // Refresh gallery

    } catch (err: any) {
      console.error("Generation error:", err);
      toast.error(err.message || "Failed to generate image. Try again.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="card p-6 sm:p-8 mt-12 bg-white">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl mb-4 text-brand-600">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Community AI Gallery</h2>
        <p className="text-gray-600">
          Powered by Gemini 3.1 Flash. Describe an image, generate it instantly, and share it with the community.
        </p>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto mb-12">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A futuristic city in Mexico at sunset, cyberpunk style..."
          className="input-field flex-1"
          disabled={isGenerating}
          required
        />
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="btn-primary whitespace-nowrap"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </button>
      </form>

      {/* Public Gallery Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-gray-400" />
          Recent Creations
        </h3>
        
        {isLoadingGallery ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">No images generated yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                <img
                  src={`data:image/jpeg;base64,${img.image_base64}`}
                  alt={img.prompt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-xs font-medium line-clamp-3 leading-relaxed">
                    "{img.prompt}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}