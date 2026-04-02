import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  tool?: string | null;
}

const StructuredData: React.FC<StructuredDataProps> = ({ tool }) => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PixelResize",
    "url": "https://pixelresize.site/"
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool ? `${tool.charAt(0).toUpperCase() + tool.slice(1)} Image Tool` : "PixelResize Image Tools",
    "url": tool ? `https://pixelresize.site/${tool}-image` : "https://pixelresize.site/",
    "applicationCategory": "Utility",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  if (!tool) {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "PixelResize",
      "url": "https://pixelresize.site/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://pixelresize.site/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is it really free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, PixelResize is 100% free with no hidden costs or limits on usage."
          }
        },
        {
          "@type": "Question",
          "name": "Are my images safe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. We use browser-based processing, meaning your images never leave your computer."
          }
        }
      ]
    };

    return (
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(webAppSchema)}
        </script>
      </Helmet>
    );
  }

  const toolMap: Record<string, any> = {
    'resize': {
      name: 'How to Resize Image Online',
      steps: ["Upload your image to the resizer.", "Enter your desired width and height in pixels.", "Click 'Process & Download' to save your resized image."]
    },
    'compress': {
      name: 'How to Compress Image Online',
      steps: ["Upload your image to the compressor.", "Adjust the quality slider to find the perfect balance.", "Click 'Process & Download' to save your compressed image."]
    },
    'convert': {
      name: 'How to Convert Image Online',
      steps: ["Upload your image to the converter.", "Select your desired output format (JPG, PNG, WebP).", "Click 'Process & Download' to save your converted image."]
    },
    'crop': {
      name: 'How to Crop Image Online',
      steps: ["Upload your image to the cropper.", "Drag the crop box to select your desired area.", "Click 'Process & Download' to save your cropped image."]
    },
    'target': {
      name: 'How to Set Target Size',
      steps: ["Upload your image to the target size tool.", "Select your desired KB size from the options.", "Click 'Process & Download' to save your optimized image."]
    },
    'transform': {
      name: 'How to Transform Image Online',
      steps: ["Upload your image to the transform tool.", "Click rotate or flip to adjust the orientation.", "Click 'Process & Download' to save your transformed image."]
    },
    'export': {
      name: 'How to Export Image Online',
      steps: ["Upload your image to the export tool.", "Choose your final format and quality settings.", "Click 'Process & Download' to save your final image."]
    }
  };

  const data = toolMap[tool];
  if (!data) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": data.name,
    "step": data.steps.map((step: string) => ({
      "@type": "HowToStep",
      "text": step
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webAppSchema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
