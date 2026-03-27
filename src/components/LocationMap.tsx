// @ts-nocheck
// src/components/LocationMap.tsx
import { MapPin, ChevronRight } from "lucide-react";

export default function LocationMap() {
  const mapSrc = "https://maps.google.com/maps?q=Paseo+de+la+Reforma+333,+Mexico+City&t=m&z=15&output=embed&iwloc=near";

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-brand-200 shadow-lg">
      <div className="bg-brand-600 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-semibold">Paseo de la Reforma 333, CDMX</span>
        </div>
        <a
          href="https://maps.google.com/?q=Paseo+de+la+Reforma+333,+Mexico+City"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-brand-100 hover:text-white transition-colors text-xs font-medium"
        >
          Open in Maps <ChevronRight className="w-3 h-3" />
        </a>
      </div>
      <iframe
        src={mapSrc}
        width="100%"
        height="300"
        style={{ border: 0, display: "block" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Office Location"
      />
      <div className="bg-brand-50 border-t border-brand-100 px-5 py-2.5 flex items-center gap-3 text-xs text-brand-700">
        <span className="w-2 h-2 bg-brand-600 rounded-full inline-block" />
        <span>Reforma 333, Col. Cuauhtémoc, 06500</span>
      </div>
    </div>
  );
}