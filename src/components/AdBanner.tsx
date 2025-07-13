
import { useEffect } from "react";

interface AdBannerProps {
  position: "header" | "sidebar" | "footer";
}

const AdBanner = ({ position }: AdBannerProps) => {
  useEffect(() => {
    // Load Adsterra ad script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//bluetackclasp.com/716ec023455c9639f2bf7e298fe9e3b8/invoke.js';
    script.async = true;
    
    // Set atOptions before loading the script
    (window as any).atOptions = {
      'key': '716ec023455c9639f2bf7e298fe9e3b8',
      'format': 'iframe',
      'height': 90,
      'width': 728,
      'params': {}
    };

    const adContainer = document.getElementById(`adsterra-${position}`);
    if (adContainer) {
      adContainer.appendChild(script);
    }

    return () => {
      // Cleanup script on unmount
      if (adContainer && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [position]);

  const getAdSize = () => {
    switch (position) {
      case "header":
        return "h-24 flex items-center justify-center";
      case "sidebar":
        return "h-24 flex items-center justify-center";
      case "footer":
        return "h-24 flex items-center justify-center";
      default:
        return "h-24 flex items-center justify-center";
    }
  };

  return (
    <div className={`w-full ${getAdSize()} my-4`}>
      <div 
        id={`adsterra-${position}`}
        className="w-full flex items-center justify-center"
      />
    </div>
  );
};

export default AdBanner;
