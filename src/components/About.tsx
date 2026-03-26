// @ts-nocheck
// src/components/About.tsx
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

const highlights = [
  "Agile methodology with 2-week sprint cycles",
  "Transparent pricing with no hidden fees",
  "Dedicated project manager for every client",
  "Post-launch support and maintenance included",
  "Performance monitoring and optimization",
  "Regular progress updates and demos",
];

function About() {
  return (
    <section id="about" className="section-padding bg-gray-50">
      <div className="container-max mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column - content */}
          <div>
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3">
              About Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              We Build Digital Products That{" "}
              <span className="gradient-text">Make a Difference</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With over a decade of experience, our team of designers, engineers, and
              strategists work together to create exceptional digital experiences. We
              believe in transparency, collaboration, and delivering results that exceed
              expectations.
            </p>

            <ul className="space-y-3 mb-8">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/contact" className="btn-primary">
              Work With Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Right column - visual */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-100 via-brand-50 to-white border border-brand-100 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="w-24 h-24 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-600/20">
                  <span className="text-4xl font-extrabold text-white">15</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Test15 Studio</h3>
                <p className="text-gray-600">Crafting digital excellence since 2012</p>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100 hidden lg:block">
              <div className="text-2xl font-bold text-brand-600">4.9★</div>
              <div className="text-xs text-gray-500">Client Rating</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100 hidden lg:block">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-xs text-gray-500">Uptime SLA</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;