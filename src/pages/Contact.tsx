// @ts-nocheck
// src/pages/Contact.tsx
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "../components/ContactForm";

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
    value: "+1 (555) 123-4567",
    description: "Mon-Fri from 8am to 5pm",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "San Francisco, CA",
    description: "123 Innovation Drive, 94102",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "9AM - 6PM PST",
    description: "Monday through Friday",
  },
];

function Contact() {
  return (
    <section className="section-padding bg-gray-50 min-h-screen">
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
          {/* Contact form - wider column */}
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

            {/* Map placeholder */}
            <div className="card overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-brand-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-brand-600">San Francisco, CA</p>
                  <p className="text-xs text-brand-400">123 Innovation Drive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;