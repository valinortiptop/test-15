// @ts-nocheck
// src/pages/Contact.tsx
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "../components/ContactForm";
import LocationMap from "../components/LocationMap";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@test15.app",
    description: "Send us an email anytime",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+52 (55) 5000-8765",
    description: "Mon–Fri from 9am to 7pm",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Reforma 333, CDMX",
    description: "Col. Cuauhtémoc, 06500",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "9AM – 7PM CST",
    description: "Monday through Friday",
  },
];

function Contact() {
  return (
    <>
      {/* Contact form section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max mx-auto">
          {/* Page header */}
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3">
              Contact Us
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Have a question or want to work together? We&apos;d love to hear from you.
              Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Contact info sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div key={info.label} className="card p-6 flex items-start gap-4">
                    <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        {info.label}
                      </p>
                      <p className="font-semibold text-gray-900">{info.value}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Map section — full width below the form */}
      <LocationMap />
    </>
  );
}

export default Contact;