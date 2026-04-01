import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const renderLink = (to: string, label: string) => {
    if (onNavigate) {
      return (
        <button 
          onClick={() => onNavigate(to)} 
          className="text-[#38bdf8] hover:text-white transition-colors text-sm"
        >
          {label}
        </button>
      );
    }
    return <Link to={to} className="text-[#38bdf8] hover:text-white transition-colors text-sm">{label}</Link>;
  };

  return (
    <>
      <footer className="bg-[#020617] py-10 mt-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-8">

          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-12 text-center md:text-left">
            
            {/* Brand */}
            <div className="flex flex-col gap-4 items-center md:items-start">
              <h4 className="text-white font-bold text-lg">PixelResize</h4>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Fast, secure, and free online image tools. All processing happens in your browser.
              </p>
            </div>

            {/* Tools */}
            <div className="flex flex-col gap-3 items-center md:items-start">
              <h4 className="text-white font-bold text-lg">Image Tools</h4>
              {renderLink("/resize-image", "Resize Image Online")}
              {renderLink("/compress-image", "Compress Image Online")}
              {renderLink("/convert-image", "Convert Image Online")}
              {renderLink("/crop-image", "Crop Image Online")}
              {renderLink("/target-size", "Target Size Compressor")}
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3 items-center md:items-start">
              <h4 className="text-white font-bold text-lg">Company</h4>
              {renderLink("/about", "About Us")}
              {renderLink("/contact", "Contact Us")}
              {renderLink("/privacy", "Privacy Policy")}
              {renderLink("/terms", "Terms of Service")}
            </div>
          </div>

          {/* Privacy Note (NEW LINE) */}
          <div className="text-center mb-8">
            <p className="text-white/50 text-xs max-w-xl mx-auto">
              All image processing is done directly in your browser. We do not upload, store, or view your images — your privacy is fully protected.
            </p>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} PixelResize. All rights reserved.
            </p>

            <div className="flex gap-6 justify-center">
              <a href="/sitemap.xml" className="text-white/40 hover:text-white text-xs transition-colors">
                Sitemap
              </a>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;
