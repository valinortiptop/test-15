// @ts-nocheck
// src/components/Features.tsx
import { Code2, Palette, Shield, Rocket, Globe, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Modern Development",
    description:
      "Built with the latest technologies including React, TypeScript, and cloud-native infrastructure for peak performance.",
  },
  {
    icon: Palette,
    title: "Beautiful Design",
    description:
      "Pixel-perfect interfaces crafted with attention to detail, ensuring an exceptional user experience across all devices.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade security protocols with end-to-end encryption, role-based access, and continuous vulnerability monitoring.",
  },
  {
    icon: Rocket,
    title: "Lightning Fast",
    description:
      "Optimized for speed with edge computing, CDN delivery, and smart caching strategies that keep load times under 100ms.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description:
      "Deploy worldwide with multi-region infrastructure that automatically scales to handle millions of concurrent users.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description:
      "Dedicated support team available around the clock, with guaranteed response times and expert-level technical assistance.",
  },
];

function Features() {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="container-max mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Powerful tools and features designed to help you build, launch, and grow
            your digital products with confidence.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="card p-8 group">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors">
                  <Icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;