// src/App.tsx
import React from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturedCars from "./components/FeaturedCars";
import WhyEV from "./components/WhyEV";
import StoreMap from "./components/StoreMap";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-navy-950 text-white font-sans overflow-x-hidden">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0d1530",
              color: "#fff",
              border: "1px solid rgba(57,255,20,0.3)",
            },
          }}
        />
        <Navbar />
        <main>
          <HeroSection />
          <FeaturedCars />
          <WhyEV />
          <StoreMap />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}