import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send, Instagram, Youtube, Facebook, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ContactFooter = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSent(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 3000);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-text',
        { x: '-6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.contact-card',
        { x: '6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hktr@tagrugbyhk.org' },
    { icon: Phone, label: 'Phone', value: '+852 0000 0000' },
    { icon: MapPin, label: 'Address', value: 'Hong Kong Tag Rugby, HK' },
  ];

  const socialLinks = [
    { icon: Instagram, url: 'https://instagram.com/hk.tagrugby' },
    { icon: Youtube, url: 'https://youtube.com/@hktagrugby' },
    { icon: Facebook, url: 'https://facebook.com/hktagrugby' },
    { icon: Twitter, url: 'https://twitter.com/hk_tagrugby' },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-flowing bg-[#0B3D2E]"
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/pitch_midfield.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B3D2E] via-[#0B3D2E]/95 to-[#0B3D2E]" />

      {/* Content */}
      <div className="relative z-10 py-20 lg:py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Contact Info */}
            <div className="contact-text space-y-8">
              <div>
                <h2
                  className="text-4xl sm:text-5xl lg:text-6xl text-white font-black mb-4"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  CONTACT
                </h2>
                <p className="text-white/70 text-lg max-w-md">
                  Questions about the tournament, media requests, or partnership
                  opportunities?
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-[#CFFF2E]" />
                    </div>
                    <div>
                      <div className="text-white/60 text-sm">{info.label}</div>
                      <div className="text-white font-medium">{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#CFFF2E] hover:text-[#0B3D2E] text-white transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="contact-card">
              <div className="bg-white rounded-2xl p-6 lg:p-8">
                <h3
                  className="text-xl font-bold text-[#0B3D2E] mb-6"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  Send a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[#0B3D2E]/60 text-sm mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-[#0B3D2E]/5 border border-[#0B3D2E]/10 rounded-xl text-[#0B3D2E] placeholder:text-[#0B3D2E]/40 focus:outline-none focus:border-[#CFFF2E] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B3D2E]/60 text-sm mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-[#0B3D2E]/5 border border-[#0B3D2E]/10 rounded-xl text-[#0B3D2E] placeholder:text-[#0B3D2E]/40 focus:outline-none focus:border-[#CFFF2E] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B3D2E]/60 text-sm mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="How can we help?"
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0B3D2E]/5 border border-[#0B3D2E]/10 rounded-xl text-[#0B3D2E] placeholder:text-[#0B3D2E]/40 focus:outline-none focus:border-[#CFFF2E] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0B3D2E] text-white rounded-xl font-semibold hover:bg-[#0B3D2E]/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>

                  {sent && (
                    <p className="text-center text-green-600 text-sm">
                      Message sent successfully!
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 lg:mt-24 pt-8 border-t border-white/10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="text-white font-bold text-xl"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  HKTR
                </span>
                <span className="text-white/40">|</span>
                <span className="text-white/60 text-sm">
                  Hong Kong Tag Rugby
                </span>
              </div>

              <div className="flex items-center gap-6 text-white/60 text-sm">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>

              <div className="text-white/40 text-sm">
                © 2026 HKTR. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default ContactFooter;
