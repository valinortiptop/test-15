// @ts-nocheck
// src/components/Hero.tsx
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 via-white to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative section-padding">
        <div className="container-max mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-100 rounded-full text-sm font-medium text-brand-700 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Welcome to Test15</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 animate-slide-up">
            Build Something{" "}
            <span className="gradient-text">Extraordinary</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-10 animate-slide-up animate-delay-100">
            We craft modern digital experiences with cutting-edge technology.
            From concept to launch, we bring your vision to life with precision and care.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animate-delay-200">
            <Link to="/contact" className="btn-primary text-base px-8 py-4">
              Start a Project
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <a href="#features" className="btn-outline text-base px-8 py-4">
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-100 animate-slide-up animate-delay-300">
            {[
              { value: "150+", label: "Projects Delivered" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "50+", label: "Team Members" },
              { value: "12+", label: "Years Experience" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;