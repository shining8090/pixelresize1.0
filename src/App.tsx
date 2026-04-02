import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Upload, 
  Menu, 
  Maximize, 
  Minimize2, 
  Search, 
  Layers, 
  ChevronDown, 
  X,
  Download,
  RefreshCcw,
  CheckCircle2,
  Info,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Settings,
  FileType,
  Target,
  RefreshCw,
  Share2,
  Crop as CropIcon,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { Toaster, toast } from 'sonner';
import { cn } from './lib/utils';
import ScrollToTop from "./components/ScrollToTop";

// --- New Components ---
import ToolCards from './components/ToolCards';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import SEOContent from './components/SEOContent';
import StructuredData from './components/StructuredData';
import LegalPage from './pages/LegalPage';

// --- Types ---
type ToolType = 'resize' | 'compress' | 'convert' | 'crop' | 'target' | 'transform' | 'export';
type ExportFormat = 'jpeg' | 'png' | 'webp' | 'gif' | 'avif';

interface ImageState {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

// --- Components ---

const TOOLS_CONFIG = [
  { id: 'resize', icon: Maximize, label: 'Resize' },
  { id: 'compress', icon: Sliders, label: 'Compress' },
  { id: 'convert', icon: FileType, label: 'Convert' },
  { id: 'crop', icon: CropIcon, label: 'Crop' },
  { id: 'target', icon: Target, label: 'Target' },
  { id: 'transform', icon: RefreshCw, label: 'Transform' },
  { id: 'export', icon: Share2, label: 'Export' },
];

const TOOL_SEO_CONFIG: Record<string, { title: string, h1: string, description: string, ogTitle: string }> = {
  'home': {
    title: 'Free Image Tools Online – Resize, Compress, Convert & Crop',
    h1: 'All-in-One Free Image Tools',
    description: 'Free online image tools to resize, compress, crop, convert and optimize images instantly without losing quality. No signup required.',
    ogTitle: 'Free Image Tools Online'
  },
  'resize': {
    title: 'Resize Image Online Free – Change Image Size Without Losing Quality',
    h1: 'Resize Image Online',
    description: 'Resize your images online without losing quality. Perfect for websites, social media, and documents.',
    ogTitle: 'Resize Image Online Free'
  },
  'compress': {
    title: 'Compress Image Online – Reduce File Size Without Losing Quality',
    h1: 'Compress Image Online',
    description: 'Compress images online to reduce file size while maintaining high quality. Optimize for web and email.',
    ogTitle: 'Compress Image Online'
  },
  'convert': {
    title: 'Convert Image Online – JPG, PNG, WebP Converter',
    h1: 'Convert Image Online',
    description: 'Convert images between JPG, PNG, WebP, and other formats instantly in your browser.',
    ogTitle: 'Convert Image Online'
  },
  'crop': {
    title: 'Crop Image Online – Free Image Cropper Tool',
    h1: 'Crop Image Online',
    description: 'Crop images online for free. Select the perfect area and download your cropped image instantly.',
    ogTitle: 'Crop Image Online'
  },
  'target': {
    title: 'Compress Image to Target Size (KB/MB) Online',
    h1: 'Target Size Compressor',
    description: 'Compress images to an exact file size (e.g., 100KB) automatically with our target size tool.',
    ogTitle: 'Target Size Compressor'
  },
  'transform': {
    title: 'Transform Image Online – Rotate & Flip Images Free',
    h1: 'Transform Image Online',
    description: 'Rotate and flip your images horizontally or vertically with our free online transform tool.',
    ogTitle: 'Transform Image Online'
  },
  'export': {
    title: 'Export Image Online – Download in Any Format',
    h1: 'Export Image Online',
    description: 'Finalize and export your images in any format and quality setting you need.',
    ogTitle: 'Export Image Online'
  }
};

const ToolPage: React.FC<{ forcedTool?: ToolType | null }> = ({ forcedTool = null }) => {
  const [images, setImages] = useState<ImageState[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>(forcedTool || 'resize');
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<ExportFormat>('jpeg');
  const [targetSize, setTargetSize] = useState<number | null>(null);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCropActive, setIsCropActive] = useState(false);
  const [cropAspectRatio, setCropAspectRatio] = useState<number | null>(null);
  const [appliedChanges, setAppliedChanges] = useState<Record<string, string | string[]>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLeavePopup, setShowLeavePopup] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const seo = forcedTool ? TOOL_SEO_CONFIG[forcedTool] : TOOL_SEO_CONFIG['home'];
  const canonicalUrl = forcedTool ? `https://pixelresize.site/${forcedTool}-image` : 'https://pixelresize.site/';

  const resetToolState = () => {
    setImages([]);
    setSelectedIndex(null);
    setAppliedChanges({});
    setHasUnsavedChanges(false);
    setQuality(80);
    setFormat('jpeg');
    setTargetSize(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setIsCropActive(false);
    setActiveTool(forcedTool || 'resize');
  };

  useEffect(() => {
    resetToolState();
  }, [location.pathname]);

  useEffect(() => {
    if (Object.keys(appliedChanges).length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [appliedChanges]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSafeNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setNextRoute(path);
      setShowLeavePopup(true);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const scrollToUpload = () => {
        const el = document.getElementById("uploadSection");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      };
      setTimeout(() => scrollToUpload(), 100);
      navigate(path);
    }
  };

  const handleDownloadComplete = () => {
    setHasUnsavedChanges(false);
  };

  useEffect(() => {
    if (forcedTool) {
      setActiveTool(forcedTool);
    }
  }, [forcedTool]);

  const updateChange = (key: string, value: string | null) => {
    setAppliedChanges(prev => {
      const next = { ...prev };
      if (value === null) {
        delete next[key];
      } else if (key === 'transform') {
        next[key] = [value];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const cropperRef = useRef<Cropper | null>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) processFiles([files[0]]);
  };

  const processFiles = (files: File[]) => {
    // Only process the first file if multiple were somehow provided
    const fileToProcess = files[0];
    if (!fileToProcess) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const newState: ImageState = {
          file: fileToProcess,
          previewUrl: event.target?.result as string,
          width: img.width,
          height: img.height,
          originalWidth: img.width,
          originalHeight: img.height,
        };
        // Clear previous images to ensure only one is active
        setImages([newState]);
        setSelectedIndex(0);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(fileToProcess);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) processFiles([files[0]]);
  };

  const image = selectedIndex !== null ? images[selectedIndex] : null;

  const handleDownload = async () => {
    if (!image) return;
    setShowConfirmModal(true);
  };

  const runProcessing = async () => {
    if (!image) return;
    setIsProcessing(true);
    await downloadImage(image);
    setIsProcessing(false);
    handleDownloadComplete();
    toast.success("Your image is ready ✅");

    // Reset after download as requested
    setTimeout(() => {
      resetToolState();
    }, 300);
  };

  const getSettingsSummary = () => {
    if (!image) return "";
    let summary = "";

    // RESIZE
    if (image.width !== image.originalWidth || image.height !== image.originalHeight) {
      summary += `<b>Resize:</b> ${image.width} x ${image.height} px 
      (Aspect Ratio: ${maintainAspectRatio ? "Yes" : "No"})<br>`;
    }

    // COMPRESS
    if (quality !== 80) {
      summary += `<b>Compress:</b> Quality ${quality}%<br>`;
    }

    // CONVERT
    if (format) {
      summary += `<b>Convert:</b> ${format.toUpperCase()}<br>`;
    }

    // TARGET
    if (targetSize) {
      summary += `<b>Target Size:</b> ${targetSize} KB<br>`;
    }

    // TRANSFORM FLAGS
    let transforms = [];
    if (rotation !== 0) transforms.push(`Rotated ${rotation}°`);
    if (flipH) transforms.push("Flip Horizontal");
    if (flipV) transforms.push("Flip Vertical");

    if (transforms.length) {
      summary += `<b>Transform:</b> ${transforms.join(", ")}<br>`;
    }

    if (summary === "") {
      summary = "No changes applied. Image will be downloaded as original.";
    }
    return summary;
  };

  const downloadImage = async (imgState: ImageState, skipDownload = false): Promise<string | Blob | null> => {
    return new Promise(async (resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);

      const img = new Image();
      img.onload = async () => {
        const isRotated90 = (rotation / 90) % 2 !== 0;
        const finalWidth = imgState.width;
        const finalHeight = imgState.height;
        
        canvas.width = isRotated90 ? finalHeight : finalWidth;
        canvas.height = isRotated90 ? finalWidth : finalHeight;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        
        ctx.drawImage(img, -imgState.width / 2, -imgState.height / 2, imgState.width, imgState.height);
        
        ctx.restore();

        const mimeType = `image/${format === 'jpeg' ? 'jpeg' : format}`;
        
        let finalQuality = quality / 100;
        
        if (targetSize) {
          // Binary search for quality to match target size
          let low = 0.01;
          let high = 1.0;
          let bestQuality = 0.5;
          
          for (let i = 0; i < 8; i++) {
            const mid = (low + high) / 2;
            const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, mimeType, mid));
            if (blob && blob.size / 1024 > targetSize) {
              high = mid;
            } else {
              bestQuality = mid;
              low = mid;
            }
          }
          finalQuality = bestQuality;
        }

        if (skipDownload) {
          canvas.toBlob((blob) => resolve(blob), mimeType, finalQuality);
        } else {
          const dataUrl = canvas.toDataURL(mimeType, finalQuality);
          const link = document.createElement('a');
          link.download = `pixelresize-${imgState.file.name.split('.')[0]}.${format}`;
          link.href = dataUrl;
          link.click();
          resolve(dataUrl);
        }
      };
      img.src = imgState.previewUrl;
    });
  };

  useEffect(() => {
    if (activeTool === 'crop' && previewImgRef.current && image) {
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }
      
      cropperRef.current = new Cropper(previewImgRef.current, {
        viewMode: 1,
        autoCropArea: 0.8,
        aspectRatio: cropAspectRatio || undefined,
        ready() {
          setIsCropActive(true);
        }
      });
    } else {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
      setIsCropActive(false);
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, [activeTool, image, selectedIndex, cropAspectRatio]);

  // Small JS touches for live meta updates as requested
  useEffect(() => {
    const qualityInput = document.getElementById("quality");
    const metaQuality = document.getElementById("meta-quality");
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");
    const metaDim = document.getElementById("meta-dim");

    const handleQualityInput = (e: Event) => {
      if (metaQuality) metaQuality.innerText = (e.target as HTMLInputElement).value + "%";
    };

    const updateDim = () => {
      if (metaDim && widthInput && heightInput) {
        metaDim.innerText = `${(widthInput as HTMLInputElement).value}×${(heightInput as HTMLInputElement).value}`;
      }
    };

    qualityInput?.addEventListener("input", handleQualityInput);
    widthInput?.addEventListener("input", updateDim);
    heightInput?.addEventListener("input", updateDim);

    return () => {
      qualityInput?.removeEventListener("input", handleQualityInput);
      widthInput?.removeEventListener("input", updateDim);
      heightInput?.removeEventListener("input", updateDim);
    };
  }, [images, selectedIndex]); // Re-attach when image changes to ensure IDs are found

  const handleApplyCrop = () => {
    if (!cropperRef.current || selectedIndex === null) return;

    const canvas = cropperRef.current.getCroppedCanvas();
    const croppedData = canvas.toDataURL();

    setImages(prev => prev.map((img, i) => i === selectedIndex ? {
      ...img,
      previewUrl: croppedData,
      width: canvas.width,
      height: canvas.height,
      originalWidth: canvas.width,
      originalHeight: canvas.height
    } : img));

    updateChange('crop', `Crop: ${canvas.width}×${canvas.height}`);
    
    cropperRef.current.destroy();
    cropperRef.current = null;
    setIsCropActive(false);
    setActiveTool('resize'); // Switch back to resize after crop
  };

  const handleCopyBase64 = async () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = async () => {
      const isRotated90 = (rotation / 90) % 2 !== 0;
      const finalWidth = image.width;
      const finalHeight = image.height;
      
      canvas.width = isRotated90 ? finalHeight : finalWidth;
      canvas.height = isRotated90 ? finalWidth : finalHeight;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      
      ctx.drawImage(img, -image.width / 2, -image.height / 2, image.width, image.height);
      
      ctx.restore();

      const mimeType = `image/${format === 'jpeg' ? 'jpeg' : format}`;
      const base64 = canvas.toDataURL(mimeType, quality / 100);
      try {
        await navigator.clipboard.writeText(base64);
        toast.success("Base64 string of processed image copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy to clipboard");
      }
    };
    img.src = image.previewUrl;
  };

  const handleProcessAll = async () => {
    setIsProcessing(true);
    const zip = new JSZip();
    
    for (const img of images) {
      const blob = await downloadImage(img, true);
      if (blob instanceof Blob) {
        zip.file(`pixelresize-${img.file.name.split('.')[0]}.${format}`, blob);
      }
    }
    
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `pixelresize-batch-${Date.now()}.zip`;
    link.click();
    
    setIsProcessing(false);
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    if (selectedIndex === idx) {
      setSelectedIndex(images.length > 1 ? 0 : null);
    } else if (selectedIndex !== null && selectedIndex > idx) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const reset = () => {
    resetToolState();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.description} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <Navbar onNavigate={handleSafeNavigation} />
<main className="flex-grow pt-16">
  <div className="max-w-7xl mx-auto px-8 py-6">
    {forcedTool && (
            <>
              <Breadcrumbs 
                current={TOOLS_CONFIG.find(t => t.id === forcedTool)?.label || ''} 
                onNavigate={handleSafeNavigation}
              />
              <StructuredData tool={forcedTool} />
            </>
          )}
          {!forcedTool && <StructuredData tool={null} />}
        </div>

        {/* Workspace & Upload Area */}
        {images.length === 0 ? (
          <section id="uploadSection" className="hero-section upload-section">
            <div className="hero-content">
              <h1>
                {seo.h1.split(' ').map((word, i, arr) => i === arr.length - 1 ? <span key={i}>{word}</span> : word + ' ')}
              </h1>
              <p>
                {seo.description}
              </p>

              <div className="upload-box">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-4 py-10">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-headline mb-2">Drop your image here</h3>
                      <p className="text-slate-400">Upload an image or click to browse from your device</p>
                      <p className="text-slate-500 text-xs mt-2">Supports JPG, PNG, WebP</p>
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 opacity-60">
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> 100% Privacy Safe</span>
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Auto-Deleted After Processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="hero-section">
            <div className="hero-content">
              <h1>
                {seo.h1.split(' ').map((word, i, arr) => i === arr.length - 1 ? <span key={i}>{word}</span> : word + ' ')}
              </h1>
              <div className="h-6" />
            </div>
          </section>
        )}

        {/* Workspace */}
        <AnimatePresence>
          {images.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="max-w-7xl mx-auto px-8 -mt-20 pb-16 relative z-10"
            >
              <div className="bg-white rounded-xl premium-shadow overflow-hidden text-on-surface">
                <div className="tool-wrapper px-8 pb-8">
                  {/* Left: Preview */}
                  <div className="preview-box">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
                          <Search className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-headline font-bold text-base tracking-tight text-slate-900">Preview</h4>
                        </div>
                      </div>
                      <button 
                        onClick={reset} 
                        className="p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all border border-slate-200 rounded-lg shadow-sm"
                        title="Clear all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden relative group">
                      {image && (
                        <img 
                          ref={previewImgRef}
                          id="preview-img"
                          src={image.previewUrl} 
                          alt="Preview" 
                          className="max-w-full max-h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      
                      {/* Floating Info Badge */}
                      {image && (
                        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl border border-white shadow-lg flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-2">
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold truncate max-w-[120px]">{image.file.name}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {images.length > 1 && (
                              <div className="flex items-center gap-1 bg-surface-container px-1.5 py-0.5 rounded-lg">
                                <button 
                                  onClick={() => setSelectedIndex(prev => prev !== null ? (prev - 1 + images.length) % images.length : 0)}
                                  className="p-0.5 hover:text-primary transition-colors"
                                >
                                  <ChevronLeft className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-[9px] font-bold">{(selectedIndex || 0) + 1}/{images.length}</span>
                                <button 
                                  onClick={() => setSelectedIndex(prev => prev !== null ? (prev + 1) % images.length : 0)}
                                  className="p-0.5 hover:text-primary transition-colors"
                                >
                                  <ChevronRight className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Replace preview bottom info with requested structure */}
                    {image && (
                      <div className="preview-meta">
                        <div className="meta-card">
                          <span>Dimensions</span>
                          <strong id="meta-dim">{image.width}×{image.height}</strong>
                        </div>
                        <div className="meta-card">
                          <span>Format</span>
                          <strong id="meta-format">{format.toUpperCase()}</strong>
                        </div>
                        <div className="meta-card">
                          <span>Quality</span>
                          <strong id="meta-quality">{quality}%</strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Controls */}
                  <div className="tools-box">
                    <div className={cn("tabs mb-6", forcedTool && "hidden")}>
                      {TOOLS_CONFIG.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => setActiveTool(tool.id as ToolType)}
                          className={cn(
                            "tab",
                            activeTool === tool.id && "active"
                          )}
                        >
                          <tool.icon className="w-4 h-4" />
                          <span>{tool.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
                      <div className={cn("tab-content", activeTool === 'resize' && "active")}>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-500">Width (px)</label>
                            <input 
                              id="width"
                              type="number" 
                              value={image?.width || 0}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const newHeight = maintainAspectRatio && image ? Math.round(val * (image.originalHeight / image.originalWidth)) : (image?.height || 0);
                                setImages(prev => prev.map((img, i) => i === selectedIndex ? {
                                  ...img,
                                  width: val,
                                  height: newHeight
                                } : img));
                                if (val && newHeight) {
                                  updateChange('resize', `Resize: ${val}×${newHeight}`);
                                } else {
                                  updateChange('resize', null);
                                }
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-500">Height (px)</label>
                            <input 
                              id="height"
                              type="number" 
                              value={image?.height || 0}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const newWidth = maintainAspectRatio && image ? Math.round(val * (image.originalWidth / image.originalHeight)) : (image?.width || 0);
                                setImages(prev => prev.map((img, i) => i === selectedIndex ? {
                                  ...img,
                                  height: val,
                                  width: newWidth
                                } : img));
                                if (val && newWidth) {
                                  updateChange('resize', `Resize: ${newWidth}×${val}`);
                                } else {
                                  updateChange('resize', null);
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <input 
                            type="checkbox" 
                            id="aspectRatio" 
                            checked={maintainAspectRatio}
                            onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary mt-0"
                            style={{ width: 'auto', marginTop: 0 }}
                          />
                          <label htmlFor="aspectRatio" className="text-xs font-medium text-slate-600">Maintain aspect ratio</label>
                        </div>
                      </div>

                      <div className={cn("tab-content", activeTool === 'compress' && "active")}>
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-bold text-slate-500">Quality</label>
                          <span className="text-primary font-bold text-sm">{quality}%</span>
                        </div>
                        <input 
                          id="quality"
                          type="range" 
                          min="1" 
                          max="100" 
                          value={quality}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setQuality(val);
                            updateChange('compress', `Compress: ${val}%`);
                          }}
                        />
                        <p className="text-xs text-slate-400 mt-2">Lower quality results in smaller file sizes.</p>
                      </div>

                      <div className={cn("tab-content", activeTool === 'convert' && "active")}>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Export Format</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['jpeg', 'png', 'webp', 'gif', 'avif'] as ExportFormat[]).map((f) => (
                            <button
                              key={f}
                              onClick={() => {
                                setFormat(f);
                                updateChange('convert', `Format: ${f.toUpperCase()}`);
                              }}
                              className={cn(
                                "format-btn",
                                format === f && "active"
                              )}
                              style={{ marginTop: 0 }}
                            >
                              <FileType className="w-4 h-4" />
                              {f.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={cn("tab-content", activeTool === 'target' && "active")}>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Target File Size</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[10, 50, 100, 200].map((size) => (
                            <button
                              key={size}
                              onClick={() => {
                                setTargetSize(size);
                                const q = size === 10 ? 30 : size === 50 ? 60 : size === 100 ? 80 : 95;
                                setQuality(q);
                                updateChange('target', `Target: ${size}KB`);
                                updateChange('compress', `Compress: ${q}%`);
                              }}
                              className={cn(
                                "kb-btn",
                                targetSize === size && "active"
                              )}
                              style={{ marginTop: 0 }}
                            >
                              {size} KB
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={cn("tab-content", activeTool === 'transform' && "active")}>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Transform Image</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            className={cn(appliedChanges.transform?.[0] === "Rotate 90°" && "transform-active")}
                            onClick={() => {
                              setRotation(90);
                              setFlipH(false);
                              setFlipV(false);
                              updateChange('transform', "Rotate 90°");
                            }}
                          >Rotate 90°</button>
                          <button 
                            className={cn(appliedChanges.transform?.[0] === "Flip H" && "transform-active")}
                            onClick={() => {
                              setRotation(0);
                              setFlipH(true);
                              setFlipV(false);
                              updateChange('transform', "Flip H");
                            }}
                          >Flip H</button>
                          <button 
                            className={cn(appliedChanges.transform?.[0] === "Flip V" && "transform-active")}
                            onClick={() => {
                              setRotation(0);
                              setFlipH(false);
                              setFlipV(true);
                              updateChange('transform', "Flip V");
                            }}
                          >Flip V</button>
                          <button onClick={handleCopyBase64}>Base64</button>
                        </div>
                      </div>

                      {/* CROP TAB */}
                      <div className={cn("tab-content", activeTool === 'crop' && "active")} id="crop">
                        <label className="block text-xs font-bold text-slate-500 mb-3">Aspect Ratio</label>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {[
                            { label: 'Free', value: null },
                            { label: '1:1', value: 1 },
                            { label: '16:9', value: 16/9 },
                            { label: '4:3', value: 4/3 },
                            { label: '3:2', value: 3/2 },
                            { label: '9:16', value: 9/16 }
                          ].map((ratio) => (
                            <button
                              key={ratio.label}
                              onClick={() => setCropAspectRatio(ratio.value)}
                              className={cn(
                                "format-btn text-xs py-2",
                                cropAspectRatio === ratio.value && "active"
                              )}
                              style={{ marginTop: 0 }}
                            >
                              {ratio.label}
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button 
                            id="applyCropBtn" 
                            disabled={!isCropActive} 
                            className={cn("btn-primary flex-1", isCropActive && "active")}
                            onClick={handleApplyCrop}
                          >
                            Apply Crop
                          </button>
                          <button 
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-bold transition-colors"
                            onClick={() => {
                              if (cropperRef.current) {
                                cropperRef.current.reset();
                              }
                            }}
                          >
                            Reset
                          </button>
                        </div>
                      </div>

                      <div className={cn("tab-content", activeTool === 'export' && "active")}>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Export Options</label>
                        <button onClick={handleCopyBase64}>Copy Base64 to Clipboard</button>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {/* AD_PLACEHOLDER: High Engagement Zone (Before Download) */}
                      <div className="ad-placeholder mb-4" id="ad-before-download"></div>

                      {/* CHANGES SUMMARY BAR */}
                      {Object.keys(appliedChanges).length > 0 && (
                        <div id="changesSummary" className="changes-summary">
                          <h4>Applied Changes</h4>
                          <div id="changesList" className="changes-list">
                            {Object.entries(appliedChanges).flatMap(([key, value]) => 
                              Array.isArray(value) 
                                ? value.map((v, i) => <span key={`${key}-${i}`} className="change-chip">{v}</span>)
                                : [<span key={key} className="change-chip">{value}</span>]
                            )}
                          </div>
                        </div>
                      )}

                      <button 
                        id="processBtn"
                        onClick={handleDownload}
                        disabled={isProcessing || !image}
                        className={cn(isProcessing && "processing")}
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <RefreshCcw className="w-5 h-5 animate-spin" />
                            Processing...
                          </span>
                        ) : "Process & Download"}
                      </button>

                      <div className="mt-3 text-center space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Free • Secure • No Signup
                        </p>
                        <p className="text-[9px] font-medium text-slate-400">
                          Images are auto-deleted after processing
                        </p>
                      </div>
                      
                      <button 
                        onClick={reset}
                        className="clear-btn text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {forcedTool && (
          <div className="max-w-7xl mx-auto px-8">
            <SEOContent tool={forcedTool} />
          </div>
        )}

        <section className="tools-section">
          {/* AD_PLACEHOLDER: Between Sections */}
          <div className="ad-placeholder mb-12" id="ad-between-sections"></div>

          <h2>All Tools</h2>

          <div className="tools-grid">
            <Link to="/resize-image" className="tool-card">
              <div className="tool-card-icon-wrapper">
                <Maximize className="w-5 h-5" />
              </div>
              <h3>Resize Image</h3>
              <p>Change width & height with precision</p>
            </Link>

            <Link to="/compress-image" className="tool-card">
              <div className="tool-card-icon-wrapper">
                <Minimize2 className="w-5 h-5" />
              </div>
              <h3>Compress Image</h3>
              <p>Reduce file size without quality loss</p>
            </Link>

            <Link to="/convert-image" className="tool-card">
              <div className="tool-card-icon-wrapper">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3>Convert Image</h3>
              <p>JPG, PNG, WEBP & more formats</p>
            </Link>

            <Link to="/crop-image" className="tool-card">
              <div className="tool-card-icon-wrapper">
                <CropIcon className="w-5 h-5" />
              </div>
              <h3>Crop Image</h3>
              <p>Trim and adjust image area easily</p>
            </Link>

            <Link to="/target-size" className="tool-card">
              <div className="tool-card-icon-wrapper">
                <Target className="w-5 h-5" />
              </div>
              <h3>Target Size</h3>
              <p>Optimize image to exact KB size</p>
            </Link>

            <Link to="/transform-image" className="tool-card">
              <div className="tool-card-icon-wrapper">
                <Sliders className="w-5 h-5" />
              </div>
              <h3>Transform</h3>
              <p>Rotate, flip & adjust orientation</p>
            </Link>

            <Link to="/export-image" className="tool-card">
              <div className="tool-card-icon-wrapper">
                <Download className="w-5 h-5" />
              </div>
              <h3>Export</h3>
              <p>Download in your desired format</p>
            </Link>
          </div>
        </section>

        {!forcedTool && (
          <div className="max-w-4xl mx-auto px-8 py-8">
            <SEOContent />
          </div>
        )}
      </main>

      <Footer onNavigate={handleSafeNavigation} />
      <Toaster position="top-center" richColors />

      {showLeavePopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3 className="font-headline">Unsaved Changes</h3>
            
            <p>
              Your current image changes have not been downloaded or saved.
              If you leave, your progress will be lost.
            </p>

            <div className="popup-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowLeavePopup(false)}
              >
                Cancel
              </button>

              <button 
                className="btn-save"
                onClick={() => {
                  // trigger download
                  document.getElementById("processDownloadBtn")?.click();
                  setHasUnsavedChanges(false);
                  setShowLeavePopup(false);
                  if (nextRoute) navigate(nextRoute);
                }}
              >
                Save & Continue
              </button>

              <button 
                className="btn-leave"
                onClick={() => {
                  setHasUnsavedChanges(false);
                  setShowLeavePopup(false);
                  if (nextRoute) navigate(nextRoute);
                }}
              >
                Leave Without Saving
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <div id="confirmModal" className={cn("modal-overlay", showConfirmModal && "show")}>
        <div className="modal-box">
          <h3 className="text-xl font-bold mb-4">Confirm Your Settings</h3>

          <div id="settingsSummary" dangerouslySetInnerHTML={{ __html: getSettingsSummary() }} />

          <div className="modal-actions mt-6 flex justify-between">
            <button 
              id="cancelProcess" 
              onClick={() => setShowConfirmModal(false)}
              className="px-6 py-2 rounded-lg bg-surface-container text-on-surface-variant font-bold hover:bg-surface-container-high transition-all"
            >
              Cancel
            </button>
            <button 
              id="processDownloadBtn" 
              onClick={() => {
                setShowConfirmModal(false);
                runProcessing();
              }}
              className="px-6 py-2 rounded-lg bg-primary text-on-primary font-bold hover:shadow-lg transition-all"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<ToolPage key="home" />} />
        <Route path="/resize-image" element={<ToolPage key="resize" forcedTool="resize" />} />
        <Route path="/compress-image" element={<ToolPage key="compress" forcedTool="compress" />} />
        <Route path="/convert-image" element={<ToolPage key="convert" forcedTool="convert" />} />
        <Route path="/crop-image" element={<ToolPage key="crop" forcedTool="crop" />} />
        <Route path="/target-size" element={<ToolPage key="target" forcedTool="target" />} />
        <Route path="/transform-image" element={<ToolPage key="transform" forcedTool="transform" />} />
        <Route path="/export-image" element={<ToolPage key="export" forcedTool="export" />} />
        
        <Route path="/privacy" element={<LegalPage title="Privacy Policy" description="Privacy Policy for PixelResize - Learn how we handle your image data securely in your browser." content={<p>We do not store your images. All uploads are automatically processed in your browser and deleted after processing. Your data never leaves your device.</p>} />} />
        <Route path="/terms" element={<LegalPage title="Terms of Service" description="Terms of Service for PixelResize - Guidelines for using our free online image tools." content={<p>By using our tools, you agree to our terms. Do not upload illegal content. PixelResize is provided "as is" without any warranties.</p>} />} />
        <Route path="/contact" element={<LegalPage title="Contact Us" description="Contact PixelResize - Get in touch with us for support or feedback." content={<p>Email: support@pixelresize.site<br /><br />We respond within 24 hours.</p>} />} />
        <Route path="/about" element={<LegalPage title="About PixelResize" description="About PixelResize - Free online platform offering powerful image tools like resize, compress, convert, and crop." content={<><p>PixelResize is a free online platform offering powerful image tools like resize, compress, convert, crop and optimize images instantly.</p><p className="mt-4">Our mission is to provide fast, secure and easy-to-use tools for everyone.</p></>} />} />
      </Routes>
    </>
  );
}
