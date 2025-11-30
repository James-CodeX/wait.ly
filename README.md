# Wait.ly - Waitlist Management Platform

A modern, full-featured waitlist management platform built with React, TypeScript, and Supabase. Create, customize, and manage waitlists with ease.

## ✨ Features

### 🎨 Customizable Waitlist Forms

- **Live Preview Editor** - See changes in real-time as you customize
- **Multiple Widget Types** - Inline, popup, and slide-in options
- **Custom Branding** - Upload logos, customize colors, and add custom CSS
- **Custom Fields** - Add company, phone, job title, and more
- **Responsive Design** - Works perfectly on all devices

### 📊 Analytics & Insights

- **Real-time Statistics** - Track signups, conversion rates, and referrals
- **Visual Charts** - Area charts, bar charts, and pie charts
- **Traffic Sources** - See where your signups are coming from
- **Daily Metrics** - Monitor performance over time

### 📧 Email Campaigns

- **Campaign Management** - Create and send email campaigns
- **Email Templates** - Pre-built templates for quick setup
- **Recipient Filtering** - Target specific segments
- **Performance Tracking** - Monitor opens and clicks

### 🔗 Integrations

- **API Keys** - Programmatic access to your waitlist
- **Webhooks** - Real-time event notifications
- **Embed Options** - Multiple ways to integrate with your site

### 🎯 Waitlist Management

- **Position Tracking** - Automatic position assignment
- **Referral System** - Built-in referral tracking
- **Search & Filter** - Find entries quickly
- **Export Data** - Download your waitlist as CSV

### 🌓 Dark Mode

- **Universal Theme Support** - Seamless light/dark mode switching
- **Persistent Preferences** - Theme choice saved across sessions
- **Accessible Design** - Optimized for readability in both modes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/waitly.git
   cd waitly
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**

   Run the migrations in the `supabase/migrations` folder to set up your database schema.

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
waitly/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Sidebar, TopBar)
│   │   └── ui/              # Reusable UI components (Button, Card, Input, Modal)
│   ├── contexts/            # React contexts (Auth, Theme)
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   ├── Analytics.tsx    # Analytics dashboard
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Emails.tsx       # Email campaigns
│   │   ├── Embed.tsx        # Embed customization
│   │   ├── Projects.tsx     # Project management
│   │   ├── PublicWaitlist.tsx # Public-facing waitlist
│   │   ├── Settings.tsx     # Settings page
│   │   └── Waitlist.tsx     # Waitlist management
│   ├── services/            # API service layer
│   ├── lib/                 # Utilities and configurations
│   └── main.tsx             # Application entry point
├── supabase/
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

## 🎨 Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Build Tool:** Vite
- **Icons:** Lucide React

## 🔧 Configuration

### Theme Customization

The app uses a universal color system for consistent theming:

```javascript
// Light Mode
bg-white, bg-mint-50
text-mint-900, text-mint-900/70

// Dark Mode
dark:bg-dark-bg, dark:bg-dark-card
dark:text-dark-text, dark:text-dark-text-muted
```

### Embed Widget

Customize your waitlist widget in the Embed page:

1. **Choose Widget Type** - Inline, Popup, or Slide-in
2. **Customize Branding** - Logo, colors, and text
3. **Add Custom Fields** - Collect additional information
4. **Copy Embed Code** - Integrate into your website

## 📊 Database Schema

Key tables:

- `projects` - Waitlist projects
- `waitlist_entries` - User signups
- `embed_configurations` - Widget customization
- `custom_fields` - Additional form fields
- `email_campaigns` - Email campaign data
- `api_keys` - API authentication
- `webhooks` - Event notifications

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- API keys for programmatic access
- Webhook secrets for secure event delivery
- User authentication via Supabase Auth

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📝 Environment Variables

| Variable                 | Description                 |
| ------------------------ | --------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL   |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide](https://lucide.dev) - Icons
- [Recharts](https://recharts.org) - Charts

## 📧 Support

For support, email support@waitly.app or open an issue on GitHub.

---

Built with ❤️ by the Wait.ly team
