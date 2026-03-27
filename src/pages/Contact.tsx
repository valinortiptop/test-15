// @ts-nocheck
// src/pages/Contact.tsx
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "../components/ContactForm";
import LocationMap from "../components/LocationMap";
import WeatherWidget from "../components/WeatherWidget";
import ImageGenerator from "../components/ImageGenerator";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@test15.app", description: "Send us an email anytime" },
  { icon: Phone, label: "Phone", value: "+52 55 4676 52", description: "Mon-Fri from 8am to 5pm" },
  { icon: MapPin, label: "Office", value: "Ciudad de México, CDMX", description: "Paseo de la Reforma 333" },
  { icon: Clock, label: "Business Hours", value: "9AM - 6PM CST", description: "Monday through Friday" },
];

export default function Contact() {
  return (
    <section className="section-padding bg-gray-50 min-h-screen">
      <div className="container-max mx-auto">

        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3">Contact Us</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <div className="lg:col-span-2 space-y-5">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="card p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{info.label}</p>
                    <p className="font-semibold text-gray-900">{info.value}</p>
                    <p className="text-sm text-gray-500">{info.description}</p>
                  </div>
                </div>
              );
            })}
            <LocationMap />
            <WeatherWidget />
          </div>
        </div>

        <ImageGenerator />

      </div>
    </section>
  );
}