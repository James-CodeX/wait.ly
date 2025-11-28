// Mock API utilities for development
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fakeFetch<T>(data: T, delayMs: number = 600): Promise<T> {
  await delay(delayMs);
  return data;
}

// Mock data types
export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  position: number;
  createdAt: string;
  status?: 'active' | 'approved' | 'rejected';
}

export interface Waitlist {
  id: string;
  name: string;
  description: string;
  totalSignups: number;
  todaySignups: number;
  weekSignups: number;
  createdAt: string;
  ownerId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  totalSignups: number;
  createdAt: string;
  lastUpdated: string;
}

// Generate mock projects
const generateMockProjects = (): Project[] => [
  {
    id: 'project-1',
    name: 'My Awesome SaaS',
    description: 'Next-gen productivity tool for teams',
    totalSignups: 47,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'project-2',
    name: 'Mobile App Launch',
    description: 'Revolutionary fitness tracking app',
    totalSignups: 128,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'project-3',
    name: 'E-commerce Platform',
    description: 'AI-powered shopping experience',
    totalSignups: 203,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    lastUpdated: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

// Generate mock waitlist entries
const generateMockEntries = (count: number): WaitlistEntry[] => {
  const names = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Ethan Hunt', 'Fiona Green', 'George Miller', 'Hannah Lee', 'Ian Wright', 'Julia Roberts'];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'startup.io'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `entry-${i + 1}`,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(' ', '.')}${i}@${domains[i % domains.length]}`,
    position: i + 1,
    createdAt: new Date(Date.now() - (count - i) * 86400000).toISOString(),
    status: 'active' as const,
  }));
};

// Mock database
let mockProjects = generateMockProjects();
let mockEntries = generateMockEntries(47);
let currentProjectId: string | null = null;
let mockUser: User = {
  id: 'user-1',
  email: 'demo@wait.ly',
  name: 'Demo User',
  createdAt: new Date().toISOString(),
};

let mockWaitlist: Waitlist = {
  id: 'waitlist-1',
  name: 'My Awesome Product',
  description: 'Join the waitlist for early access',
  totalSignups: 47,
  todaySignups: 3,
  weekSignups: 12,
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  ownerId: 'user-1',
};

// API functions
export const mockApi = {
  // Auth
  login: async (email: string, password: string) => {
    await delay(800);
    if (email && password) {
      return fakeFetch({ user: mockUser, success: true });
    }
    throw new Error('Invalid credentials');
  },

  signup: async (name: string, email: string, _password: string) => {
    await delay(800);
    mockUser = { ...mockUser, name, email };
    return fakeFetch({ user: mockUser, success: true });
  },

  // Projects
  getProjects: async () => {
    await delay(400);
    return fakeFetch(mockProjects);
  },

  getProject: async (projectId: string) => {
    await delay(300);
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');
    return fakeFetch(project);
  },

  createProject: async (name: string, description: string) => {
    await delay(600);
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      description,
      totalSignups: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    mockProjects.unshift(newProject);
    return fakeFetch(newProject);
  },

  selectProject: (projectId: string) => {
    currentProjectId = projectId;
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return;

    // Generate entries based on project's totalSignups
    const totalSignups = project.totalSignups;
    mockEntries = generateMockEntries(totalSignups);
    
    // Calculate stats based on the entries
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const todaySignups = mockEntries.filter(e => new Date(e.createdAt) >= todayStart).length;
    const weekSignups = mockEntries.filter(e => new Date(e.createdAt) >= weekStart).length;
    
    mockWaitlist = {
      ...mockWaitlist,
      totalSignups,
      todaySignups,
      weekSignups,
    };
  },

  getCurrentProject: () => {
    return currentProjectId;
  },

  // Waitlist
  getWaitlist: async () => {
    return fakeFetch(mockWaitlist);
  },

  getEntries: async (search?: string) => {
    await delay(400);
    let entries = [...mockEntries];
    if (search) {
      entries = entries.filter(e => 
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    return fakeFetch(entries);
  },

  addEntry: async (name: string, email: string) => {
    await delay(600);
    const newEntry: WaitlistEntry = {
      id: `entry-${Date.now()}`,
      name,
      email,
      position: mockEntries.length + 1,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    mockEntries.unshift(newEntry);
    mockWaitlist.totalSignups++;
    mockWaitlist.todaySignups++;
    mockWaitlist.weekSignups++;
    return fakeFetch(newEntry);
  },

  deleteEntry: async (id: string) => {
    await delay(400);
    mockEntries = mockEntries.filter(e => e.id !== id);
    mockWaitlist.totalSignups--;
    return fakeFetch({ success: true });
  },

  // Stats
  getStats: async () => {
    return fakeFetch({
      totalSignups: mockWaitlist.totalSignups,
      todaySignups: mockWaitlist.todaySignups,
      weekSignups: mockWaitlist.weekSignups,
    });
  },

  getRecentEntries: async (limit = 10) => {
    await delay(300);
    return fakeFetch(mockEntries.slice(0, limit));
  },
};

// Mock analytics data
export const mockAnalytics = {
  totalSignups: 1247,
  thisWeek: 156,
  conversionRate: 3.8,
  referralRate: 42,
  signupsOverTime: [
    { date: '2024-03-01', signups: 45 },
    { date: '2024-03-02', signups: 52 },
    { date: '2024-03-03', signups: 48 },
    { date: '2024-03-04', signups: 61 },
    { date: '2024-03-05', signups: 55 },
    { date: '2024-03-06', signups: 72 },
    { date: '2024-03-07', signups: 68 },
    { date: '2024-03-08', signups: 58 },
    { date: '2024-03-09', signups: 65 },
    { date: '2024-03-10', signups: 71 },
  ],
  dailySignups: [
    { day: 'Mon', count: 45 },
    { day: 'Tue', count: 52 },
    { day: 'Wed', count: 48 },
    { day: 'Thu', count: 61 },
    { day: 'Fri', count: 55 },
    { day: 'Sat', count: 38 },
    { day: 'Sun', count: 42 },
  ],
  trafficSources: [
    { name: 'Direct', value: 35 },
    { name: 'Social', value: 28 },
    { name: 'Referral', value: 22 },
    { name: 'Email', value: 15 },
  ],
};

// Mock email campaigns
export const mockEmailCampaigns = [
  {
    id: '1',
    name: 'Welcome Series',
    subject: 'Welcome to the waitlist!',
    sent: 1247,
    opened: 892,
    clicked: 324,
    status: 'sent',
    date: '2024-03-15',
  },
  {
    id: '2',
    name: 'Position Update',
    subject: "You've moved up in line!",
    sent: 856,
    opened: 645,
    clicked: 198,
    status: 'sent',
    date: '2024-03-17',
  },
  {
    id: '3',
    name: 'Launch Announcement',
    subject: 'Coming Soon!',
    sent: 0,
    opened: 0,
    clicked: 0,
    status: 'draft',
    date: '2024-03-20',
  },
];

// Mock email templates
export const mockEmailTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to {{waitlist_name}}!',
    body: 'Hi {{name}},\n\nThank you for joining our waitlist! You are currently at position {{position}}.\n\nBest regards,\nThe Team',
  },
  {
    id: 'position-update',
    name: 'Position Update',
    subject: "You've moved up!",
    body: 'Hi {{name}},\n\nGreat news! You are now at position {{position}} on our waitlist.\n\nBest regards,\nThe Team',
  },
];
