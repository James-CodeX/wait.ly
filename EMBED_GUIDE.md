# Wait.ly Embed Guide

## How It Works

Wait.ly provides a simple, working embed system for your waitlist forms. Here's how everything connects:

### 1. **Public Waitlist Page** (`/public/:projectId`)

- This is the actual waitlist form that users see
- Fully customizable through the Embed page
- Supports custom fields, branding, and styling
- Handles form submissions and displays success messages
- Shows waitlist position and referral links

### 2. **Dashboard Quick Start**

The Dashboard provides three integration methods:

#### Method 1: Share Public Link

```
https://your-domain.com/public/PROJECT_ID
```

- Direct link to your waitlist page
- Share on social media, emails, etc.
- No coding required

#### Method 2: Embed with iframe

```html
<iframe
  src="https://your-domain.com/public/PROJECT_ID"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 12px;"
></iframe>
```

- Embed directly on your website
- Works with any HTML page
- Responsive and customizable

#### Method 3: React/Next.js Component

```jsx
function WaitlistEmbed() {
  return (
    <iframe
      src="https://your-domain.com/public/PROJECT_ID"
      width="100%"
      height="600"
      frameBorder="0"
      style={{ border: "none", borderRadius: "12px" }}
    />
  );
}
```

### 3. **Embed Page** (`/embed`)

Full customization interface:

#### Branding

- Logo upload
- Custom heading and description
- Primary color picker
- Custom CSS support

#### Form Configuration

- Widget type (inline, popup, slide-in)
- Button text
- Success message
- Show/hide waitlist position

#### Custom Fields

- Quick add presets (Company, Phone, Job Title, etc.)
- Create custom fields
- Set required/optional
- Reorder fields

#### Embed Code

- Framework-specific snippets (HTML, React, Vue, Angular, Svelte, Next.js)
- Live preview
- One-click copy

### 4. **Data Flow**

```
User fills form → PublicWaitlist component → publicWaitlistService
                                                    ↓
                                            Supabase Database
                                                    ↓
                                    Dashboard shows stats & entries
```

### 5. **Key Features**

✅ **Working iframe embed** - No external JS needed
✅ **Customizable branding** - Match your brand colors and style
✅ **Custom fields** - Collect any data you need
✅ **Referral system** - Built-in viral growth
✅ **Position tracking** - Show users their place in line
✅ **Real-time updates** - Dashboard updates automatically
✅ **Framework agnostic** - Works with any tech stack

### 6. **Testing the Embed**

1. Go to Dashboard
2. Copy the iframe code from "Quick Start"
3. Paste into any HTML file or website
4. The form will work immediately
5. Submissions appear in your Dashboard

### 7. **Customization**

All customization is done through the Embed page:

- Visual changes update the live preview
- Click "Save Configuration" to persist changes
- Changes apply to the public page immediately
- No need to update embed code after customization

## Technical Notes

- The embed uses the `/public/:projectId` route
- All styling is applied server-side (no external dependencies)
- Custom CSS can be added for advanced styling
- The iframe is responsive and mobile-friendly
- CORS is not an issue since it's an iframe
