
import { useEffect } from "react";

interface AdBannerProps {
  position: "header" | "sidebar" | "footer";
}

const AdBanner = ({ position }: AdBannerProps) => {
  useEffect(() => {
    // This is where Adsterra scripts would be initialized
    // Users can replace these placeholder divs with actual Adsterra ad units
    console.log(`Ad banner loaded for position: ${position}`);
  }, [position]);

  const getAdSize = () => {
    switch (position) {
      case "header":
        return "h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700";
      case "sidebar":
        return "h-64 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700";
      case "footer":
        return "h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700";
      default:
        return "h-24 bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <div className={`w-full ${getAdSize()} flex items-center justify-center border rounded-lg my-4`}>
      <div 
        id={`adsterra-${position}`}
        className="text-center text-gray-500 dark:text-gray-400"
      >
        <div className="text-sm font-medium">Advertisement</div>
        <div className="text-xs mt-1">Adsterra Ads Placeholder - {position}</div>
      </div>
    </div>
  );
};

export default AdBanner;
