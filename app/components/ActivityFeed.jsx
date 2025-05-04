"use client"

import { 
  Github, 
  Code, 
  Share2, 
  Star, 
  Activity 
} from "lucide-react";

// Component for the Activity Feed
const ActivityFeed = ({ activities }) => {
  // Map icon names to components
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Github': <Github className="h-5 w-5 text-primary" />,
      'Code': <Code className="h-5 w-5 text-primary" />,
      'Share2': <Share2 className="h-5 w-5 text-primary" />,
      'Star': <Star className="h-5 w-5 text-primary" />,
      'Activity': <Activity className="h-5 w-5 text-primary" />
    };
    
    return iconMap[iconName] || <Activity className="h-5 w-5 text-primary" />;
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-secondary/50 rounded-lg transition-colors">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {getIconComponent(activity.icon)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <p className="font-medium truncate">
                <span className="mr-1 font-bold">{activity.user}</span> 
                {activity.action} in <span className="text-primary">{activity.project}</span>
              </p>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{activity.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;