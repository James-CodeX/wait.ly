export async function fakeFetch<T>(data: T, delay: number = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

export const mockWaitlistEntries = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    position: 1,
    signupDate: '2024-03-15',
    status: 'active',
    referrals: 3,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@example.com',
    position: 2,
    signupDate: '2024-03-15',
    status: 'active',
    referrals: 1,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    position: 3,
    signupDate: '2024-03-16',
    status: 'active',
    referrals: 5,
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'dkim@example.com',
    position: 4,
    signupDate: '2024-03-16',
    status: 'active',
    referrals: 0,
  },
  {
    id: '5',
    name: 'Jessica Taylor',
    email: 'jtaylor@example.com',
    position: 5,
    signupDate: '2024-03-17',
    status: 'active',
    referrals: 2,
  },
];

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
