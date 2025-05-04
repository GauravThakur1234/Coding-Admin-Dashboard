"use client"
import { useState } from "react";
import { LineChart, ArrowUpRight, Code, Server, CreditCard, Users } from "lucide-react";
import StatsCard from "././components/StatsCard";
import ActivityFeed from "././components/ActivityFeed";
import ProjectCard from "./components/ProjectCard";
import { initialProjects } from "./data/index";

// Sample activity data
const sampleActivities = [
  { 
    id: 1, 
    type: "commit", 
    user: "Alex Johnson", 
    project: "E-commerce Platform", 
    details: "Added payment processing integration", 
    time: "2 hours ago" 
  },
  { 
    id: 2, 
    type: "star", 
    user: "Maria Garcia", 
    project: "Analytics Dashboard", 
    details: "Starred your project", 
    time: "1 day ago" 
  },
  { 
    id: 3, 
    type: "share", 
    user: "Sam Taylor", 
    project: "E-commerce Platform", 
    details: "Shared your project", 
    time: "2 days ago" 
  },
  { 
    id: 4, 
    type: "code", 
    user: "Jamie Chen", 
    project: "Mobile App", 
    details: "Created pull request #42", 
    time: "3 days ago" 
  },
  { 
    id: 5, 
    type: "activity", 
    user: "Taylor Wilson", 
    project: "API Service", 
    details: "Deployed v2.1.0 to production", 
    time: "5 days ago" 
  }
];

// Component for the Dashboard page
const Dashboard = () => {
  const [projects] = useState(initialProjects);
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Projects" 
          value="12" 
          change={8.2} 
          icon={<Code className="h-6 w-6" />} 
          color="blue" 
        />
        <StatsCard 
          title="API Calls" 
          value="1.2M" 
          change={24.5} 
          icon={<Server className="h-6 w-6" />} 
          color="green" 
        />
        <StatsCard 
          title="Revenue" 
          value="$12,875" 
          change={-2.4} 
          icon={<CreditCard className="h-6 w-6" />} 
          color="red" 
        />
        <StatsCard 
          title="Active Users" 
          value="843" 
          change={16.8} 
          icon={<Users className="h-6 w-6" />} 
          color="purple" 
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold">Weekly Performance</h2>
            <button className="text-sm text-blue-600 flex items-center gap-1">
              View Report <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center">
            <LineChart className="h-6 w-6 text-gray-400" />
            <span className="ml-2 text-gray-500">Chart visualization placeholder</span>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Recent Activity</h2>
            <button className="text-sm text-blue-600 flex items-center gap-1">
              View All <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <ActivityFeed activities={sampleActivities} />
        </div>
      </div>
      
      {/* Featured Projects Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Featured Projects</h2>
          <button className="text-sm text-blue-600 flex items-center gap-1">
            View All <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;