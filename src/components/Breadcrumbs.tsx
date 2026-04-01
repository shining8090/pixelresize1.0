import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface BreadcrumbsProps {
  current: string;
  onNavigate?: (path: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ current, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-on-surface-variant mb-8 whitespace-nowrap overflow-x-auto no-scrollbar">
      {onNavigate ? (
        <button 
          onClick={() => onNavigate('/')} 
          className="flex items-center gap-1 hover:text-primary transition-colors font-bold"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      ) : (
        <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors font-bold">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      )}
      
      <span className="mx-2 text-outline-variant/30">|</span>
      
      <div className="flex items-center gap-2">
        {onNavigate ? (
          <button onClick={() => onNavigate('/')} className="hover:text-primary transition-colors">Home</button>
        ) : (
          <Link to="/">Home</Link>
        )}
        <span className="breadcrumb-separator"><ChevronRight size={14} /></span>
        <span>Tools</span>
        <span className="breadcrumb-separator"><ChevronRight size={14} /></span>
        <span className="breadcrumb-current font-bold text-primary">{current}</span>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
