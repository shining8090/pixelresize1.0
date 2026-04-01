import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Image as ImageIcon } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const Logo = (
    <div className="flex items-center gap-2">
      <div className="bg-[#38bdf8] p-1.5 rounded-lg">
        <ImageIcon className="w-5 h-5 text-white" />
      </div>
      <span className="text-2xl font-black tracking-tighter text-white">
        Pixel<span className="text-[#38bdf8]">Resize</span>
      </span>
    </div>
  );

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
  };

  const handleToolsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const scrollToTools = () => {
      const el = document.getElementById('tools');
      if (el) {
        const offset = 80; // Account for fixed navbar height
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    if (location.pathname === '/') {
      scrollToTools();
    } else {
      navigate('/');
      setTimeout(scrollToTools, 100);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#020617] border-b border-slate-800 shadow-lg">
      <div className="flex justify-between lg:grid lg:grid-cols-3 items-center h-16 px-6 md:px-8 max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <div className="flex-shrink-0 justify-self-start">
          <Link to="/" onClick={handleHomeClick} className="hover:opacity-90 transition-opacity">
            {Logo}
          </Link>
        </div>
        
        {/* Desktop Links - Properly Spaced */}
        <div className="hidden lg:flex items-center justify-self-center gap-10">
          <button onClick={handleHomeClick} className="text-slate-300 hover:text-[#ffffff] transition-colors">Home</button>
          <button onClick={handleToolsClick} className="text-slate-300 hover:text-[#ffffff] transition-colors">Tools</button>
          <Link to="/about" className="text-slate-300 hover:text-[#38bdf8] transition-colors">About Us</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button className="text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-[#020617] flex flex-col items-center pt-20 gap-8 z-40 lg:hidden animate-in fade-in slide-in-from-top-4">
            <button className="text-2xl text-white" onClick={handleHomeClick}>Home</button>
            <button className="text-2xl text-white" onClick={handleToolsClick}>Tools</button>
            <Link className="text-2xl text-white" to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
