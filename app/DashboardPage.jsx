"use client"
import { useState, useEffect } from 'react';
import { 
  LineChart, BarChart, PieChart, ArrowUpRight, Code, Server, 
  CreditCard, Users, Star, GitBranch, GitPullRequest, 
  Bell,
  CheckCircle, AlertCircle, Activity, Clock, Github
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

// Sample data (will be replaced with real GitHub API data)
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    totalWatchers: 0,
    totalIssues: 0,
    totalPRs: 0
  });
  const [commitActivity, setCommitActivity] = useState([]);
  const [languageStats, setLanguageStats] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const token = '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';

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
      return null;
    }
  };

  const fetchRepositories = async (username) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch repositories');
      
      const data = await response.json();
      setRepositories(data);

      const totalStars = data.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = data.reduce((sum, repo) => sum + repo.forks_count, 0);
      const totalWatchers = data.reduce((sum, repo) => sum + repo.watchers_count, 0);
      
      setStats(prev => ({
        ...prev,
        totalRepos: data.length,
        totalStars,
        totalForks,
        totalWatchers
      }));
      
      const languages = {};
      data.forEach(repo => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });
      
      const languageData = Object.entries(languages).map(([name, value]) => ({
        name,
        value
      }));
      
      setLanguageStats(languageData);
      
      return data;
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setError('Failed to load repository data');
      return [];
    }
  };

  const fetchUserActivities = async (username) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/events?per_page=30`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch activities');
      
      const data = await response.json();
      
      const processedActivities = data.map(event => {
        let type = 'activity';
        let details = '';
        
        switch (event.type) {
          case 'PushEvent':
            type = 'commit';
            details = `Pushed ${event.payload.commits?.length || 0} commits to ${event.repo.name}`;
            break;
          case 'CreateEvent':
            type = 'code';
            details = `Created ${event.payload.ref_type} ${event.payload.ref || ''} in ${event.repo.name}`;
            break;
          case 'PullRequestEvent':
            type = 'pull-request';
            details = `${event.payload.action} pull request in ${event.repo.name}`;
            break;
          case 'IssuesEvent':
            type = 'issue';
            details = `${event.payload.action} issue in ${event.repo.name}`;
            break;
          case 'WatchEvent':
            type = 'star';
            details = `Starred ${event.repo.name}`;
            break;
          case 'ForkEvent':
            type = 'fork';
            details = `Forked ${event.repo.name}`;
            break;
          default:
            details = `Activity in ${event.repo.name}`;
        }
        
        return {
          id: event.id,
          type,
          user: event.actor.login,
          avatar: event.actor.avatar_url,
          project: event.repo.name.split('/')[1],
          repository: event.repo.name,
          details,
          time: new Date(event.created_at).toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      });
      
      setActivities(processedActivities);
      return processedActivities;
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activity data');
      return [];
    }
  };

  const fetchCommitActivity = async (repo) => {
    if (!repo) return;
    
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/stats/commit_activity`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch commit activity');
      
      const data = await response.json();
      
      const lastFewWeeks = data.slice(-8);
      const chartData = lastFewWeeks.map((week, index) => ({
        name: `Week ${index + 1}`,
        commits: week.total
      }));
      
      setCommitActivity(chartData);
      return chartData;
    } catch (err) {
      console.error('Error fetching commit activity:', err);
      setError('Failed to load commit activity data');
      return [];
    }
  };

  const fetchIssuesAndPRs = async (username) => {
    try {
      const issuesResponse = await fetch(`https://api.github.com/search/issues?q=author:${username}+is:issue+is:open`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!issuesResponse.ok) throw new Error('Failed to fetch issues');
      const issuesData = await issuesResponse.json();
      
      const prsResponse = await fetch(`https://api.github.com/search/issues?q=author:${username}+is:pr+is:open`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!prsResponse.ok) throw new Error('Failed to fetch PRs');
      const prsData = await prsResponse.json();
      
      setStats(prev => ({
        ...prev,
        totalIssues: issuesData.total_count,
        totalPRs: prsData.total_count
      }));
      
      return { issues: issuesData.total_count, prs: prsData.total_count };
    } catch (err) {
      console.error('Error fetching issues and PRs:', err);
      setError('Failed to load issues and PRs data');
      return { issues: 0, prs: 0 };
    }
  };

  const fetchContributors = async (repo) => {
    if (!repo) return;
    
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=5`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch contributors');
      
      const data = await response.json();
      setContributors(data);
      return data;
    } catch (err) {
      console.error('Error fetching contributors:', err);
      setError('Failed to load contributors data');
      return [];
    }
  };
const loadData = async () => {
  setLoading(true);
  try {
    const profileData = await fetchUserProfile();
    
    if (profileData) {
      const username = profileData.login;
      
      const [repoData, activityData, issuesPRsData] = await Promise.all([
        fetchRepositories(username),
        fetchUserActivities(username),
        fetchIssuesAndPRs(username),
      ]);
      if (repoData && repoData.length > 0) {
        const mainRepo = `${username}/${repoData[0].name}`;
        await fetchCommitActivity(mainRepo);
        await fetchContributors(mainRepo);
      }
    }
  } catch (err) {
    console.error('Failed to load data:', err);
    setError('Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
};

<Card>
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
    <CardDescription>Your GitHub notifications</CardDescription>
  </CardHeader>
  <CardContent>
    {notifications && notifications.length > 0 ? (
      <div className="space-y-4">
        {notifications.slice(0, 5).map((notification) => (
          <div key={notification.id} className="flex items-start space-x-4 p-2 rounded-lg hover:bg-gray-50">
            <div className="bg-blue-100 p-2 rounded-full">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium">{notification.repository.name}</span>
                <span className="text-xs text-gray-500">{new Date(notification.updated_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.subject.title}</p>
              <div className="mt-1">
                <Badge variant="outline" className="text-xs">
                  {notification.reason}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">No notifications available. This may be due to token permissions.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.open('https://github.com/settings/tokens', '_blank')}>
          Check Token Permissions
        </Button>
      </div>
    )}
  </CardContent>
</Card>

useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    try {
      const profileData = await fetchUserProfile();
      
      if (profileData) {
        const username = profileData.login;

        await Promise.all([
          fetchRepositories(username),
          fetchUserActivities(username),
          fetchIssuesAndPRs(username)
        ]);

        if (repositories.length > 0) {
          const mainRepo = `${username}/${repositories[0].name}`;
          await fetchCommitActivity(mainRepo);
          await fetchContributors(mainRepo);
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, []);
  const ActivityFeed = ({ activities }) => {
    return (
      <div className="space-y-4">
        {activities.slice(0, 5).map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-2 rounded-lg hover:bg-gray-50">
            <div className="bg-blue-100 p-2 rounded-full">
              {activity.type === 'commit' && <Code className="h-5 w-5 text-blue-600" />}
              {activity.type === 'star' && <Star className="h-5 w-5 text-yellow-600" />}
              {activity.type === 'fork' && <GitBranch className="h-5 w-5 text-green-600" />}
              {activity.type === 'pull-request' && <GitPullRequest className="h-5 w-5 text-purple-600" />}
              {activity.type === 'issue' && <AlertCircle className="h-5 w-5 text-red-600" />}
              {activity.type === 'code' && <Code className="h-5 w-5 text-indigo-600" />}
              {activity.type === 'activity' && <Activity className="h-5 w-5 text-gray-600" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{activity.user}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
              <div className="mt-1">
                <Badge variant="outline" className="text-xs">
                  {activity.repository}
                </Badge>
              </div>
            </div>
          </div>
        ))}
        {activities.length > 5 && (
          <Button variant="ghost" className="w-full text-blue-600 mt-2">
            View all activities
          </Button>
        )}
      </div>
    );
  };

  const ProjectCard = ({ project }) => {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
            <Badge variant={project.private ? "secondary" : "outline"}>
              {project.private ? "Private" : "Public"}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 h-10">
            {project.description || "No description available"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: project.language === 'JavaScript' ? '#f1e05a' : 
                                        project.language === 'TypeScript' ? '#2b7489' :
                                        project.language === 'Python' ? '#3572A5' :
                                        project.language === 'Java' ? '#b07219' :
                                        project.language === 'C#' ? '#178600' :
                                        project.language === 'PHP' ? '#4F5D95' :
                                        project.language === 'Ruby' ? '#701516' :
                                        project.language === 'CSS' ? '#563d7c' :
                                        project.language === 'HTML' ? '#e34c26' : '#ccc' }} />
              <span>{project.language || "N/A"}</span>
            </div>
            <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              <span>{project.stargazers_count}</span>
            </div>
            <div className="flex items-center">
              <GitBranch className="h-4 w-4 mr-1 text-green-500" />
              <span>{project.forks_count}</span>
            </div>
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
              <span>{project.open_issues_count}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => window.open(project.html_url, '_blank')}>
            View Repository
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const StatsCard = ({ title, value, icon, change, color }) => {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`rounded-full p-2 bg-${color}-100`}>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change !== undefined && (
            <p className={`text-xs flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
              <span className="text-gray-500 ml-1">from last month</span>
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your GitHub dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center mb-4 md:mb-0">
          {profile && (
            <>
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{profile.login?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{profile.name || profile.login}</h1>
                <p className="text-gray-600">@{profile.login}</p>
              </div>
            </>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => fetchUserProfile()}>
            <Clock className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button onClick={() => window.open(`https://github.com/${profile?.login}`, '_blank')}>
            <Github className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard 
          title="Total Repositories" 
          value={stats.totalRepos} 
          icon={<Code className="h-5 w-5 text-blue-600" />} 
          color="blue" 
        />
        <StatsCard 
          title="Total Stars" 
          value={stats.totalStars} 
          icon={<Star className="h-5 w-5 text-yellow-600" />} 
          color="yellow" 
        />
        <StatsCard 
          title="Total Forks" 
          value={stats.totalForks} 
          icon={<GitBranch className="h-5 w-5 text-green-600" />} 
          color="green" 
        />
        <StatsCard 
          title="Total Watchers" 
          value={stats.totalWatchers} 
          icon={<Users className="h-5 w-5 text-indigo-600" />} 
          color="indigo" 
        />
        <StatsCard 
          title="Open Issues" 
          value={stats.totalIssues} 
          icon={<AlertCircle className="h-5 w-5 text-red-600" />} 
          color="red" 
        />
        <StatsCard 
          title="Open PRs" 
          value={stats.totalPRs} 
          icon={<GitPullRequest className="h-5 w-5 text-purple-600" />} 
          color="purple" 
        />
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Commit Activity</CardTitle>
                <CardDescription>Last 8 weeks of commit activity</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {commitActivity.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={commitActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="commits" fill="#3b82f6" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No commit data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
                <CardDescription>Repository language distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {languageStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={languageStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {languageStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No language data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent GitHub activity</CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length > 0 ? (
                  <ActivityFeed activities={activities} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent activities found</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Your GitHub notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-4 p-2 rounded-lg hover:bg-gray-50">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{notification.repository.name}</span>
                            <span className="text-xs text-gray-500">{new Date(notification.updated_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.subject.title}</p>
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs">
                              {notification.reason}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No notifications found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Popular Repositories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repositories.slice(0, 3).map(repo => (
                <ProjectCard key={repo.id} project={repo} />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="repositories" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Repositories</h2>
            <Button variant="outline" onClick={() => window.open(`https://github.com/${profile?.login}?tab=repositories`, '_blank')}>
              View on GitHub
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map(repo => (
              <ProjectCard key={repo.id} project={repo} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Your detailed activity history</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-2 rounded-lg hover:bg-gray-50">
                      <div className="bg-blue-100 p-2 rounded-full">
                        {activity.type === 'commit' && <Code className="h-5 w-5 text-blue-600" />}
                        {activity.type === 'star' && <Star className="h-5 w-5 text-yellow-600" />}
                        {activity.type === 'fork' && <GitBranch className="h-5 w-5 text-green-600" />}
                        {activity.type === 'pull-request' && <GitPullRequest className="h-5 w-5 text-purple-600" />}
                        {activity.type === 'issue' && <AlertCircle className="h-5 w-5 text-red-600" />}
                        {activity.type === 'code' && <Code className="h-5 w-5 text-indigo-600" />}
                        {activity.type === 'activity' && <Activity className="h-5 w-5 text-gray-600" />}
                      </div>
                      
<div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={activity.avatar} />
                              <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{activity.user}</span>
                          </div>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            {activity.repository}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No activity history found</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contribution Calendar</CardTitle>
              <CardDescription>Your contribution heatmap for the past year</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="text-center py-8">
                <p className="text-gray-500">Calendar visualization will be implemented using the GitHub contributions API</p>
                <Button variant="outline" className="mt-4" onClick={() => window.open(`https://github.com/${profile?.login}`, '_blank')}>
                  View on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Commits by Day of Week</CardTitle>
                <CardDescription>When you're most active</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      { name: 'Sunday', commits: 12 },
                      { name: 'Monday', commits: 25 },
                      { name: 'Tuesday', commits: 31 },
                      { name: 'Wednesday', commits: 28 },
                      { name: 'Thursday', commits: 33 },
                      { name: 'Friday', commits: 22 },
                      { name: 'Saturday', commits: 9 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="commits" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Commit Time Distribution</CardTitle>
                <CardDescription>Commits by hour of day</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={Array.from({ length: 24 }, (_, i) => ({
                      hour: `${i}:00`,
                      commits: Math.floor(Math.random() * 15) + 1,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="commits" stroke="#82ca9d" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contribution Streak</CardTitle>
                <CardDescription>Your daily contribution history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Current Streak</p>
                      <p className="text-2xl font-bold">7 days</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Longest Streak</p>
                      <p className="text-2xl font-bold">23 days</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Contributions</p>
                      <p className="text-2xl font-bold">1,347</p>
                    </div>
                  </div>
                  
                  <Progress value={70} />
                  
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`h-6 rounded-sm ${
                          i % 7 === 0 ? 'bg-gray-100' : 
                          i % 7 === 1 ? 'bg-green-100' : 
                          i % 7 === 2 ? 'bg-green-200' : 
                          i % 7 === 3 ? 'bg-green-300' : 
                          i % 7 === 4 ? 'bg-green-400' : 
                          i % 7 === 5 ? 'bg-green-500' : 
                          'bg-green-600'
                        }`} 
                        title={`${i + 1} contributions`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Repositories by Stars</CardTitle>
                <CardDescription>Your most popular repositories</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={repositories
                      .sort((a, b) => b.stargazers_count - a.stargazers_count)
                      .slice(0, 5)
                      .map(repo => ({
                        name: repo.name,
                        stars: repo.stargazers_count
                      }))}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="stars" fill="#FFB800" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
              <CardDescription>People who contributed to your repositories</CardDescription>
            </CardHeader>
            <CardContent>
              {contributors.length > 0 ? (
                <div className="space-y-4">
                  {contributors.map((contributor) => (
                    <div key={contributor.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={contributor.avatar_url} />
                          <AvatarFallback>{contributor.login.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{contributor.login}</p>
                          <p className="text-sm text-gray-500">{contributor.contributions} contributions</p>
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => window.open(contributor.html_url, '_blank')}>
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No contributor data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <footer className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">GitHub Dashboard</p>
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} Your Company</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" onClick={() => window.open('https://github.com', '_blank')}>
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.open('https://docs.github.com/en/rest', '_blank')}>
              <Code className="h-4 w-4 mr-2" />
              API Docs
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.open('https://github.com/settings/tokens', '_blank')}>
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Tokens
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;