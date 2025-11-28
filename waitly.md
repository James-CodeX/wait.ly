Build a full production-quality frontend for the Wait.ly SaaS.
Do NOT implement backend, database, Supabase, or APIs.
Use mock data + placeholder async calls.
All UI must follow the updated mint–green theme below.

🎨 1. Updated Design System (USE THESE EXACT COLORS)
Color Palette (Mint-Green Theme)

Background: #FFFFFF (White)

Surface: #ECFDF5 (Very Light Mint)

Primary: #059669 (Deep Mint) — buttons, accents, highlights

Text Primary: #064E3B (Dark Green)

Text Secondary: rgba(6, 78, 59, 0.7)

Success: #10B981 (Green)

Border / Divider: rgba(6, 78, 59, 0.15)

Visual Style

Soft mint & green aesthetic

Clean, premium, minimalistic

Smooth rounded corners (12–16px)

Surface cards have subtle shadows + mint tint

Inputs use mint borders and soft glow on focus

Animations are calm and fluid (Framer Motion)

Mint-Themed UI Rules

Buttons = Deep Mint background + White text

Cards = Very Light Mint surface

Icons = Dark Green tint

Charts = Green tones

Modals = Soft transparency + mint overlay

Avoid harsh blacks — always use Dark Green as primary text color

🧱 2. General Requirements

Build ALL frontend pages/components from the two provided spec files
(waitly-project-phases.md + bolt-waitly-prompt.md).

Frontend only.

Use fakeFetch() for any async simulation.

Add loading states, skeletons, and full animations.

Use Recharts for charts.

Use Framer Motion for animations.

Fully responsive.

🗂️ 3. Pages to Build

/ — Landing

/auth/login

/auth/signup

/dashboard

/waitlist

/embed

/emails

/analytics

/settings

/public/[waitlist-id] (public signup page preview)

🔥 4. Build These UIs (Mint Theme Applied Everywhere)
Landing Page

Mint gradient accents

Floating mint-glass cards

Clean pricing section

Soft scrolling animations

Auth Pages

Mint glassmorphism card

Input fields with mint border & mint focus glow

Button in Deep Mint (#059669)

📊 Dashboard

Stat cards in Very Light Mint with Dark Green text

Animated counters

Recharts using green palette only

Recent signup list in mint-themed rows

📋 Waitlist Management

Mint search bar

Mint-filter dropdowns

Table:

Name, email, position

Hover = mint highlight

Slide-in panel with mint-glass style

Pagination with mint buttons

🔧 Embed Generator

Code editor left, preview right

Real-time customization:

Primary color = mint

Button text

Heading

Success message

Custom field builder

Tabs for:

Inline

Popup

Slide-in

Copy-to-clipboard with mint toast

✉️ Email Manager

Campaign list

Template cards in mint-theme

Email editor with mint toolbar

Desktop/Mobile preview

Campaign stats chips (mint)

📈 Analytics

Green area chart

Green bar chart

Green pie chart

Time range selector

Animated stat cards

⚙️ Settings Page (Mint Styled)

Tabs:

General

Branding

Custom Fields

Email Config

Integrations

Danger Zone

Use mint color for toggles, fields, buttons, and accents.

🧩 5. Components to Build (Mint Theme Versions)

Primary Button (Deep Mint)

Secondary Button (White with mint border)

Inputs with mint border + mint glow

Cards in Very Light Mint

Modals with mint overlay

Toasts (mint success, mint error)

Dropdowns

Pagination

Sidebar (white) with mint active state

Top bar with mint icons

Badge + chip components

🎉 6. Animations

Page fade + stagger

Button hover: slight scale + mint shadow

Cards: soft lift

Inputs: mint glow focus ring

Success animations using green tones

Confetti mint-green burst on waitlist creation

🧪 7. Mock Data

Use mock objects for:

waitlist entries

user profile

email templates

analytics stats

embed settings

Implement using fakeFetch().

📱 8. Responsiveness

Mobile-first

Collapsible sidebar

Scrollable data tables

Touch-friendly controls

❗ Strict Rules

NO black (#000)—use Dark Green #064E3B

NO purple/blue gradients from previous prompt

Absolute priority: mint/green visual identity

No backend code whatsoever

All interactive pieces must work with mock data
