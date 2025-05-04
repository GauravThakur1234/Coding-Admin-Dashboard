"use client"

import { ArrowUpRight } from "lucide-react";

// Component for stats card
const StatsCard = ({ title, value, change, icon, color }) => {
  const isPositive = change > 0;
  
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <div className="flex items-center mt-2">
        <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowUpRight className="h-4 w-4 mr-1 rotate-180" />
          )}
          <span className="text-sm">{Math.abs(change)}%</span>
        </div>
        <span className="text-sm text-muted-foreground ml-2">from last month</span>
      </div>
    </div>
  );
};

export default StatsCard;