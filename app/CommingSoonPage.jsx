"use client"
import { Palette } from "lucide-react";

// Component for pages that are coming soon
const CommingSoonPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="bg-blue-100 p-4 rounded-full mb-6">
          <Palette className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4">{title || "Coming Soon"}</h2>
        <p className="text-gray-600 mb-8">
          We're working hard to bring you this feature. Check back soon for updates!
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default CommingSoonPage;