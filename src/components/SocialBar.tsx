import { useEffect } from "react";

const SocialBar = () => {
  useEffect(() => {
    // Load Adsterra social bar script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//bluetackclasp.com/65/70/e9/6570e976c2df5a41c0cc078a76623db4.js';
    script.async = true;
    
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // Social bar script handles its own rendering
};

export default SocialBar;