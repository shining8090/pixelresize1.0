import React from 'react';
import { Link } from 'react-router-dom';
import { Maximize, Minimize, RefreshCw, Crop, Target, RotateCw, Download } from 'lucide-react';

const tools = [
  {
    id: 'resize',
    title: 'Resize Image',
    description: 'Change image size easily.',
    path: '/resize-image',
    icon: <Maximize size={24} />
  },
  {
    id: 'compress',
    title: 'Compress Image',
    description: 'Reduce file size fast.',
    path: '/compress-image',
    icon: <Minimize size={24} />
  },
  {
    id: 'convert',
    title: 'Convert Image',
    description: 'JPG, PNG, WebP converter.',
    path: '/convert-image',
    icon: <RefreshCw size={24} />
  },
  {
    id: 'crop',
    title: 'Crop Image',
    description: 'Crop images online.',
    path: '/crop-image',
    icon: <Crop size={24} />
  },
  {
    id: 'target',
    title: 'Target Size',
    description: 'Compress to exact KB.',
    path: '/target-size',
    icon: <Target size={24} />
  },
  {
    id: 'transform',
    title: 'Transform',
    description: 'Rotate & flip images.',
    path: '/transform-image',
    icon: <RotateCw size={24} />
  },
  {
    id: 'export',
    title: 'Export',
    description: 'Download in any format.',
    path: '/export-image',
    icon: <Download size={24} />
  }
];

interface ToolCardsProps {
  onNavigate?: (path: string) => void;
}

const ToolCards: React.FC<ToolCardsProps> = ({ onNavigate }) => {
  return (
    <section className="tool-cards-grid">
      {tools.map((tool) => {
        const CardContent = (
          <>
            <div className="tool-card-icon">
              {tool.icon}
            </div>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <div className="tool-card-cta">
              Open Tool →
            </div>
          </>
        );

        if (onNavigate) {
          return (
            <button 
              key={tool.id} 
              onClick={() => onNavigate(tool.path)} 
              className="tool-card text-left w-full"
            >
              {CardContent}
            </button>
          );
        }

        return (
          <Link key={tool.id} to={tool.path} className="tool-card">
            {CardContent}
          </Link>
        );
      })}
    </section>
  );
};

export default ToolCards;
