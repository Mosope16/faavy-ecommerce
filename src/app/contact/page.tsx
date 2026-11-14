import React from "react";
import { MessageCircle, MapPin, Mail, Phone, Clock } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

export default function ContactPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#E8E3D8] pb-8 mb-12">
          <FadeIn direction="up">
            <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
              Private Client Services
            </span>
            <h1 className="font-serif-luxury mt-2 text-4xl sm:text-5xl font-normal text-[#1A1A1A]">
              Connect with FAAVY Concierge
            </h1>
            <p className="mt-3 text-sm text-neutral-600 max-w-xl font-light">
              Whether you require bespoke measurements, corporate fleet suiting for your executive board, or tracking updates on an active order, our concierge team is at your command.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#F5F2EB] border border-[#E8E3D8] p-6 space-y-6">
              <h3 className="font-serif-luxury text-lg font-medium text-[#1A1A1A]">
                The Oye-Ekiti Atelier
              </h3>

              <div className="space-y-4 text-xs text-neutral-600">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#8C6F45] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1A1A1A]">Atelier & Headquarters</strong>
                    <span>Federal University Road, Oye-Ekiti, Ekiti State, Nigeria</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-[#8C6F45] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1A1A1A]">Direct Email</strong>
                    <span>concierge@faavy.ng</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-[#8C6F45] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1A1A1A]">Telephone</strong>
                    <span>+234 814 000 0000</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-[#8C6F45] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1A1A1A]">Operating Hours</strong>
                    <span>Monday – Saturday: 08:00 – 18:00 WAT</span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Action */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/2348140000000?text=${encodeURIComponent(
                    "Hello FAAVY Concierge, I would like to make an enquiry regarding your bespoke tailoring."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#1EBE5D] transition-colors shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7 bg-white border border-[#E8E3D8] p-6 sm:p-8">
            <h3 className="font-serif-luxury text-xl font-medium text-[#1A1A1A] mb-2">
              Send an Atelier Enquiry
            </h3>
            <p className="text-xs text-neutral-500 mb-6 font-light">
              We respond to all written enquiries within 4 business hours.
            </p>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Adesola Babatunde"
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D8] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D8] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="babatunde@corporate.ng"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D8] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Subject / Nature of Commission
                </label>
                <select className="w-full bg-[#FAF8F5] border border-[#E8E3D8] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden">
                  <option>Bespoke Suiting Commission</option>
                  <option>Executive Corporate Gown Inquiry</option>
                  <option>Fleet / Organization Corporate Attire</option>
                  <option>Active Order Tracking Status</option>
                  <option>General Concierge Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Message / Sizing Notes *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Please describe your requirements, preferred fabrics, or specific delivery deadlines..."
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D8] p-3 text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] hover:bg-[#C5A880] hover:text-[#121212] transition-colors"
              >
                Submit Consultation Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
