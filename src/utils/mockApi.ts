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
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

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
let mockEntries = generateMockEntries(47);
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
