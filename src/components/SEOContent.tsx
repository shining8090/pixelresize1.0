import React from 'react';
import { CheckCircle2, HelpCircle, Zap, Shield, Image as ImageIcon, Layout, Smartphone, Globe } from 'lucide-react';

interface SEOContentProps {
  tool?: string;
}

const SEOContent: React.FC<SEOContentProps> = ({ tool }) => {
  return (
    <div className="mt-16 space-y-16">
      {/* Introduction */}
      <section className="max-w-4xl mx-auto text-center px-6 relative">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
        <h2 className="text-4xl md:text-6xl font-black font-headline mb-8 text-on-surface tracking-tight leading-[1.1]">
          The Ultimate Free <span className="text-primary">Image Resizer</span> & Optimizer
        </h2>
        <p className="text-xl text-on-surface-variant leading-relaxed max-w-3xl mx-auto font-medium opacity-90">
          PixelResize is your all-in-one <strong>image resizer</strong> designed to help you <strong>resize image online</strong> quickly and securely. 
          Whether you need to <strong>compress image online</strong> to <strong>reduce image size</strong> for faster website loading or <strong>convert image online</strong> 
          between popular formats like <strong>PNG, JPG, and WebP</strong>, our tool handles it all directly in your browser. 
        </p>
      </section>

      {/* How to Use */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-surface-container-lowest rounded-[3rem] p-10 md:p-20 border border-outline-variant/20 shadow-2xl shadow-primary/5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[3rem] -z-10"></div>
            <h2 className="text-3xl md:text-4xl font-black font-headline mb-16 text-center tracking-tight">How to Use PixelResize</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent -z-10"></div>
              
              {[
                { step: "01", title: "Upload", desc: "Drag and drop your images or click to select files from your device." },
                { step: "02", title: "Adjust Settings", desc: "Choose to resize, compress, or convert. Set dimensions like 1920x1080 or target a specific file size." },
                { step: "03", title: "Download", desc: "Preview your changes and download your optimized images instantly." }
              ].map((item, i) => (
                <div key={i} className="group flex flex-col items-center text-center space-y-6 transition-all duration-300 hover:-translate-y-2">
                  <div className="relative">
                    <span className="w-20 h-20 bg-surface-container-high text-primary rounded-3xl flex items-center justify-center font-black text-2xl shadow-lg group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 rotate-3 group-hover:rotate-0">
                      {item.step}
                    </span>
                    <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                    <p className="text-on-surface-variant text-base leading-relaxed opacity-80">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-10 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Lightning Fast</h3>
            <p className="text-on-surface-variant text-base leading-relaxed opacity-80">Process dozens of images in seconds. No waiting for server uploads or queues. Everything happens in real-time.</p>
          </div>
          
          <div className="group p-10 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">100% Private</h3>
            <p className="text-on-surface-variant text-base leading-relaxed opacity-80">Your photos never leave your computer. All <strong>image compression</strong> happens locally in your browser. Security first.</p>
          </div>

          <div className="group p-10 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Pro Quality</h3>
            <p className="text-on-surface-variant text-base leading-relaxed opacity-80"><strong>Resize image without losing quality</strong>. Our algorithms maintain sharpness and color accuracy for professional results.</p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-black font-headline mb-10 text-center">Perfect for Every Platform</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center p-6 text-center space-y-3">
            <Smartphone className="w-8 h-8 text-primary" />
            <h4 className="font-bold">Social Media</h4>
            <p className="text-xs text-on-surface-variant">Get the ideal <strong>youtube thumbnail size</strong> or <strong>resize image for instagram</strong> and Facebook.</p>
          </div>
          <div className="flex flex-col items-center p-6 text-center space-y-3">
            <Layout className="w-8 h-8 text-primary" />
            <h4 className="font-bold">Websites</h4>
            <p className="text-xs text-on-surface-variant"><strong>Resize photo for website</strong> use to boost SEO and page speed significantly.</p>
          </div>
          <div className="flex flex-col items-center p-6 text-center space-y-3">
            <Globe className="w-8 h-8 text-primary" />
            <h4 className="font-bold">Online Forms</h4>
            <p className="text-xs text-on-surface-variant">Quickly <strong>compress image to 100kb</strong> or 50kb for government and job applications.</p>
          </div>
          <div className="flex flex-col items-center p-6 text-center space-y-3">
            <ImageIcon className="w-8 h-8 text-primary" />
            <h4 className="font-bold">Printing</h4>
            <p className="text-xs text-on-surface-variant">Easily <strong>resize image to 4x6</strong> or other standard print dimensions at high resolution.</p>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-primary/5 rounded-[2rem] p-8 md:p-12 border border-primary/10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black font-headline mb-6">Expert Tips for Image Optimization</h2>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
            <p className="text-on-surface-variant"><strong>Maintain Aspect Ratio:</strong> Always lock the aspect ratio when you <strong>change image dimensions</strong> to prevent stretching or squishing.</p>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
            <p className="text-on-surface-variant"><strong>Choose the Right Format:</strong> Use <strong>WebP</strong> for the best balance of quality and <strong>file size</strong> on the web. Use PNG for transparent backgrounds.</p>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
            <p className="text-on-surface-variant"><strong>Target Specific Sizes:</strong> If a site requires you to <strong>compress image to 50kb</strong>, use our "Target Size" tool for precise results.</p>
          </li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <h2 className="text-2xl md:text-3xl font-black font-headline mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold text-lg flex gap-2 items-center">
              <HelpCircle className="w-5 h-5 text-primary" />
              How can I resize an image to 1920x1080?
            </h3>
            <p className="text-on-surface-variant text-sm pl-7">
              Simply upload your image, select the "Resize" tool, enter 1920 for width and 1080 for height. You can choose to "Fit" or "Fill" to handle different aspect ratios.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg flex gap-2 items-center">
              <HelpCircle className="w-5 h-5 text-primary" />
              Can I compress an image to exactly 20kb?
            </h3>
            <p className="text-on-surface-variant text-sm pl-7">
              Yes! Use our "Target Size" compressor and enter "20" in the KB field. Our tool will automatically find the best settings to <strong>make image smaller</strong> while staying under your limit.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg flex gap-2 items-center">
              <HelpCircle className="w-5 h-5 text-primary" />
              Does resizing reduce image quality?
            </h3>
            <p className="text-on-surface-variant text-sm pl-7">
              When you <strong>reduce image size</strong>, some data is removed, but our advanced resampling ensures you <strong>resize image without losing quality</strong> visible to the human eye.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg flex gap-2 items-center">
              <HelpCircle className="w-5 h-5 text-primary" />
              What is the best size for a Facebook cover photo?
            </h3>
            <p className="text-on-surface-variant text-sm pl-7">
              The recommended <strong>facebook cover photo</strong> size is 820x312 pixels for desktops and 640x360 pixels for smartphones. We recommend using 820x360 for the best results across all devices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SEOContent;
