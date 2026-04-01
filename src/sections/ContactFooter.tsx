import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, Globe, Send, Instagram, Youtube, Facebook, Twitter } from 'lucide-react';

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
      // Open email client with pre-filled message
      const subject = `Message from ${formData.name} - HKTR Website`;
      const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
      window.open(`mailto:info@tagrugbyhk.org?subject=${subject}&body=${body}`, '_blank');
      
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
    { icon: Mail, label: 'Email', value: 'info@tagrugbyhk.org' },
    { icon: Phone, label: 'Phone', value: '+852 5795 1682' },
    { icon: Globe, label: 'Website', value: 'https://tagrugbyhk.org/', isLink: true },
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
      className="relative w-full bg-[#0B3D2E]"
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
      <div className="relative z-10 py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Contact Info */}
            <div className="contact-text space-y-6 sm:space-y-8">
              <div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl text-white font-black mb-2 sm:mb-4"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  CONTACT
                </h2>
                <p className="text-white/70 text-sm sm:text-base lg:text-lg max-w-md">
                  Questions about the tournament, media requests, or partnership
                  opportunities?
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-3 sm:space-y-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#CFFF2E]" />
                    </div>
                    <div>
                      <div className="text-white/60 text-xs sm:text-sm">{info.label}</div>
                      {info.isLink ? (
                        <a 
                          href={info.value} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white font-medium text-sm sm:text-base hover:text-[#CFFF2E] transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-white font-medium text-sm sm:text-base">{info.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2 sm:gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#CFFF2E] hover:text-[#0B3D2E] text-white transition-colors"
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="contact-card">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
                <h3
                  className="text-lg sm:text-xl font-bold text-[#0B3D2E] mb-4 sm:mb-6"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  Send a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-[#0B3D2E]/60 text-xs sm:text-sm mb-1.5 sm:mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your name"
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#0B3D2E]/5 border border-[#0B3D2E]/10 rounded-lg sm:rounded-xl text-[#0B3D2E] text-sm placeholder:text-[#0B3D2E]/40 focus:outline-none focus:border-[#CFFF2E] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B3D2E]/60 text-xs sm:text-sm mb-1.5 sm:mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#0B3D2E]/5 border border-[#0B3D2E]/10 rounded-lg sm:rounded-xl text-[#0B3D2E] text-sm placeholder:text-[#0B3D2E]/40 focus:outline-none focus:border-[#CFFF2E] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B3D2E]/60 text-xs sm:text-sm mb-1.5 sm:mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="How can we help?"
                      rows={3}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#0B3D2E]/5 border border-[#0B3D2E]/10 rounded-lg sm:rounded-xl text-[#0B3D2E] text-sm placeholder:text-[#0B3D2E]/40 focus:outline-none focus:border-[#CFFF2E] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-[#0B3D2E] text-white rounded-lg sm:rounded-xl font-semibold hover:bg-[#0B3D2E]/90 transition-colors text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>

                  {sent && (
                    <p className="text-center text-green-600 text-xs sm:text-sm">
                      Opening email client...
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 sm:mt-16 lg:mt-20 pt-6 sm:pt-8 border-t border-white/10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="text-white font-bold text-lg sm:text-xl"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  HKTR
                </span>
                <span className="text-white/40">|</span>
                <span className="text-white/60 text-xs sm:text-sm">
                  Hong Kong Tag Rugby
                </span>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 text-white/60 text-xs sm:text-sm">
                <a 
                  href="https://drive.google.com/file/d/1OHSdTN_diykkLabb24A178mMD4QbVQlo/view?usp=drive_link" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>

              <div className="text-white/40 text-xs sm:text-sm">
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
