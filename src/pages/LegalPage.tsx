import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface LegalPageProps {
  title: string;
  content: React.ReactNode;
  description?: string;
}

const LegalPage: React.FC<LegalPageProps> = ({ title, content, description }) => {
  return (
    <div className="max-w-7xl mx-auto px-8 pt-32 pb-24">
      <Helmet>
        <title>{title} - PixelResize</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <Link to="/" className="back-to-home">
        <ArrowLeft size={18} />
        Back to Home
      </Link>
      
      <div className="max-w-3xl mx-auto bg-surface-container p-12 rounded-3xl border border-white/5">
        <h1 className="text-4xl font-black mb-8">{title}</h1>
        <div className="prose prose-invert prose-slate max-w-none text-on-surface-variant leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
