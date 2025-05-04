// Expanded placeholder data for projects
export const initialProjects = [
	{ 
	  id: 1, 
	  name: "E-commerce Platform", 
	  description: "Full-stack e-commerce application with payment processing and inventory management.",
	  language: "TypeScript", 
	  tags: ["Next.js", "React", "MongoDB", "Stripe", "TailwindCSS"], 
	  lastUpdated: "2025-04-01", 
	  stars: 24,
	  progress: 85,
	  team: ["JS", "AK", "RL"],
	  color: "#3b82f6",
	  activity: "high",
	  image: "/api/placeholder/400/200"
	},
	{ 
	  id: 2, 
	  name: "AI Image Generator", 
	  description: "Web application that uses machine learning to generate images from text descriptions.", 
	  language: "Python", 
	  tags: ["Flask", "TensorFlow", "React", "AWS", "OpenAI"], 
	  lastUpdated: "2025-04-15", 
	  stars: 47,
	  progress: 67,
	  team: ["JS", "TH"],
	  color: "#8b5cf6",
	  activity: "medium",
	  image: "/api/placeholder/400/200"
	},
	{ 
	  id: 3, 
	  name: "Task Management API", 
	  description: "RESTful API for task management with authentication and authorization.", 
	  language: "JavaScript", 
	  tags: ["Express", "MongoDB", "JWT", "Docker", "GraphQL"], 
	  lastUpdated: "2025-04-20", 
	  stars: 18,
	  progress: 92,
	  team: ["JS", "AK", "MB"],
	  color: "#ec4899",
	  activity: "high",
	  image: "/api/placeholder/400/200"
	},
	{ 
	  id: 4, 
	  name: "Portfolio Website", 
	  description: "Personal portfolio website showcasing projects and skills with interactive animations.", 
	  language: "JavaScript", 
	  tags: ["HTML", "CSS", "React", "Three.js", "GSAP"], 
	  lastUpdated: "2025-03-25", 
	  stars: 5,
	  progress: 100,
	  team: ["JS"],
	  color: "#10b981",
	  activity: "low",
	  image: "/api/placeholder/400/200"
	},
	{ 
	  id: 5, 
	  name: "Markdown Note Taking App", 
	  description: "Note taking application with markdown support and cloud sync featuring collaborative editing.", 
	  language: "TypeScript", 
	  tags: ["React", "Firebase", "Redux", "Socket.io", "Draftjs"], 
	  lastUpdated: "2025-04-10", 
	  stars: 31,
	  progress: 78,
	  team: ["JS", "MB", "TH"],
	  color: "#f59e0b",
	  activity: "medium",
	  image: "/api/placeholder/400/200"
	},
	{ 
	  id: 6, 
	  name: "Finance Dashboard", 
	  description: "Interactive dashboard for tracking personal finances with data visualization and forecasting.", 
	  language: "TypeScript", 
	  tags: ["React", "D3.js", "Firebase", "Material UI"], 
	  lastUpdated: "2025-04-18", 
	  stars: 12,
	  progress: 45,
	  team: ["JS", "AK"],
	  color: "#06b6d4",
	  activity: "high",
	  image: "/api/placeholder/400/200"
	}
  ];
  
  // Enhanced analytics data
  export const analyticsData = [
	{ month: 'Jan', commits: 45, issues: 12, pulls: 8 },
	{ month: 'Feb', commits: 52, issues: 15, pulls: 10 },
	{ month: 'Mar', commits: 61, issues: 18, pulls: 12 },
	{ month: 'Apr', commits: 67, issues: 10, pulls: 15 },
	{ month: 'May', commits: 55, issues: 21, pulls: 11 },
  ];
  
  // Language distribution data
  export const languageData = [
	{ name: 'JavaScript', value: 42, color: '#f7df1e' },
	{ name: 'TypeScript', value: 28, color: '#3178c6' },
	{ name: 'Python', value: 18, color: '#3776ab' },
	{ name: 'Java', value: 8, color: '#b07219' },
	{ name: 'Other', value: 4, color: '#8e8e8e' },
  ];
  
  // Recent activity data
  export const activityData = [
	{
	  id: 1,
	  type: 'commit',
	  project: 'E-commerce Platform',
	  user: 'JS',
	  action: 'Implemented cart functionality',
	  time: '2 hours ago',
	  icon: 'Github'
	},
	{
	  id: 2,
	  type: 'update',
	  project: 'AI Image Generator',
	  user: 'TH',
	  action: 'Updated TensorFlow models',
	  time: '5 hours ago',
	  icon: 'Code'
	},
	{
	  id: 3,
	  type: 'share',
	  project: 'Task Management API',
	  user: 'AK',
	  action: 'Shared project with team',
	  time: 'Yesterday',
	  icon: 'Share2'
	},
	{
	  id: 4,
	  type: 'star',
	  project: 'E-commerce Platform',
	  user: 'MB',
	  action: 'Starred your project',
	  time: 'Yesterday',
	  icon: 'Star'
	},
	{
	  id: 5,
	  type: 'issue',
	  project: 'Markdown Note Taking App',
	  user: 'RL',
	  action: 'Reported bug in sync function',
	  time: '2 days ago',
	  icon: 'Activity'
	}
  ];
  
  // Notifications data
  export const notificationsData = [
	{
	  id: 1,
	  title: 'New star on E-commerce Platform',
	  description: 'Someone starred your project',
	  time: '2 hours ago',
	  read: false
	},
	{
	  id: 2,
	  title: 'Pull request approved',
	  description: 'Your PR was approved by the team',
	  time: '5 hours ago',
	  read: false
	},
	{
	  id: 3,
	  title: 'Team meeting reminder',
	  description: 'Weekly sync in 30 minutes',
	  time: 'Just now',
	  read: false
	},
	{
	  id: 4,
	  title: 'New comment on commit',
	  description: 'Amanda left a comment on your commit',
	  time: 'Yesterday',
	  read: true
	}
  ];
  
  // GitHub repositories data
  export const repositories = [
	{ name: "e-commerce-platform", stars: 24, forks: 18, issues: 7, lastUpdated: "2 days ago", language: "TypeScript" },
	{ name: "ai-image-generator", stars: 47, forks: 29, issues: 12, lastUpdated: "5 days ago", language: "Python" },
	{ name: "task-manager-api", stars: 18, forks: 8, issues: 4, lastUpdated: "1 week ago", language: "JavaScript" },
	{ name: "portfolio-website", stars: 5, forks: 2, issues: 1, lastUpdated: "2 weeks ago", language: "JavaScript" },
	{ name: "markdown-notes", stars: 31, forks: 12, issues: 8, lastUpdated: "3 days ago", language: "TypeScript" }
  ];