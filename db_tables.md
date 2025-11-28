# Wait.ly Database Schema

## Overview

This document defines the database tables, fields, and relationships for the Wait.ly application using Supabase PostgreSQL with Supabase Auth.

---

## Authentication

**Using Supabase Auth** - Built-in authentication with `auth.users` table

---

## Tables

### 1. `profiles`

User profile information (extends Supabase auth.users)

| Column       | Type         | Constraints                            | Description                   |
| ------------ | ------------ | -------------------------------------- | ----------------------------- |
| `id`         | uuid         | PRIMARY KEY, REFERENCES auth.users(id) | User ID from Supabase Auth    |
| `email`      | varchar(255) | NOT NULL, UNIQUE                       | User email (synced from auth) |
| `name`       | varchar(255) | NOT NULL                               | Full name                     |
| `created_at` | timestamptz  | NOT NULL, DEFAULT now()                | Profile creation timestamp    |
| `updated_at` | timestamptz  | NOT NULL, DEFAULT now()                | Last update timestamp         |

**Indexes:**

- `profiles_email_idx` on `email`

---

### 2. `projects`

Waitlist projects created by users

| Column          | Type         | Constraints                                         | Description             |
| --------------- | ------------ | --------------------------------------------------- | ----------------------- |
| `id`            | uuid         | PRIMARY KEY, DEFAULT uuid_generate_v4()             | Unique project ID       |
| `owner_id`      | uuid         | NOT NULL, REFERENCES profiles(id) ON DELETE CASCADE | Owner user ID           |
| `name`          | varchar(255) | NOT NULL                                            | Project name            |
| `description`   | text         |                                                     | Project description     |
| `total_signups` | integer      | NOT NULL, DEFAULT 0                                 | Total number of signups |
| `created_at`    | timestamptz  | NOT NULL, DEFAULT now()                             | Creation timestamp      |
| `updated_at`    | timestamptz  | NOT NULL, DEFAULT now()                             | Last update timestamp   |

**Indexes:**

- `projects_owner_id_idx` on `owner_id`
- `projects_created_at_idx` on `created_at`

---

### 3. `waitlist_entries`

Individual waitlist signups for projects

| Column          | Type         | Constraints                                         | Description                        |
| --------------- | ------------ | --------------------------------------------------- | ---------------------------------- |
| `id`            | uuid         | PRIMARY KEY, DEFAULT uuid_generate_v4()             | Unique entry ID                    |
| `project_id`    | uuid         | NOT NULL, REFERENCES projects(id) ON DELETE CASCADE | Associated project                 |
| `name`          | varchar(255) | NOT NULL                                            | Signup name                        |
| `email`         | varchar(255) | NOT NULL                                            | Signup email                       |
| `position`      | integer      | NOT NULL                                            | Position in waitlist               |
| `status`        | varchar(20)  | NOT NULL, DEFAULT 'active'                          | Status: active, approved, rejected |
| `custom_fields` | jsonb        |                                                     | Custom field data                  |
| `referral_code` | varchar(50)  | UNIQUE                                              | Unique referral code               |
| `referred_by`   | uuid         | REFERENCES waitlist_entries(id)                     | Referrer entry ID                  |
| `created_at`    | timestamptz  | NOT NULL, DEFAULT now()                             | Signup timestamp                   |
| `updated_at`    | timestamptz  | NOT NULL, DEFAULT now()                             | Last update timestamp              |

**Indexes:**

- `waitlist_entries_project_id_idx` on `project_id`
- `waitlist_entries_email_project_id_idx` on `(email, project_id)` (prevent duplicate signups)
- `waitlist_entries_referral_code_idx` on `referral_code`
- `waitlist_entries_created_at_idx` on `created_at`

**Unique Constraint:**

- `unique_email_per_project` on `(email, project_id)`

---

### 4. `embed_configurations`

Customization settings for embed widgets

| Column            | Type         | Constraints                                                 | Description                          |
| ----------------- | ------------ | ----------------------------------------------------------- | ------------------------------------ |
| `id`              | uuid         | PRIMARY KEY, DEFAULT uuid_generate_v4()                     | Configuration ID                     |
| `project_id`      | uuid         | NOT NULL, UNIQUE, REFERENCES projects(id) ON DELETE CASCADE | Associated project                   |
| `heading`         | varchar(255) | NOT NULL, DEFAULT 'Join Our Waitlist'                       | Form heading                         |
| `description`     | text         |                                                             | Form description                     |
| `button_text`     | varchar(100) | NOT NULL, DEFAULT 'Join Now'                                | Submit button text                   |
| `success_message` | text         | NOT NULL, DEFAULT 'Thanks for joining!'                     | Success message                      |
| `primary_color`   | varchar(7)   | NOT NULL, DEFAULT '#059669'                                 | Primary color (hex)                  |
| `secondary_color` | varchar(7)   | DEFAULT '#ECFDF5'                                           | Secondary color (hex)                |
| `show_position`   | boolean      | NOT NULL, DEFAULT true                                      | Show waitlist position               |
| `show_logo`       | boolean      | NOT NULL, DEFAULT true                                      | Show logo                            |
| `logo_url`        | text         |                                                             | Logo image URL                       |
| `custom_css`      | text         |                                                             | Custom CSS code                      |
| `widget_type`     | varchar(20)  | NOT NULL, DEFAULT 'inline'                                  | Widget type: inline, popup, slide-in |
| `created_at`      | timestamptz  | NOT NULL, DEFAULT now()                                     | Creation timestamp                   |
| `updated_at`      | timestamptz  | NOT NULL, DEFAULT now()                                     | Last update timestamp                |

**Indexes:**

- `embed_configurations_project_id_idx` on `project_id`

---

### 5. `custom_fields`

Custom fields configuration for waitlist forms

| Column        | Type         | Constraints                                         | Description                                |
| ------------- | ------------ | --------------------------------------------------- | ------------------------------------------ |
| `id`          | uuid         | PRIMARY KEY, DEFAULT uuid_generate_v4()             | Field ID                                   |
| `project_id`  | uuid         | NOT NULL, REFERENCES projects(id) ON DELETE CASCADE | Associated project                         |
| `name`        | varchar(255) | NOT NULL                                            | Field name                                 |
| `type`        | varchar(50)  | NOT NULL                                            | Field type: Text, Phone, URL, Select, etc. |
| `placeholder` | varchar(255) |                                                     | Placeholder text                           |
| `required`    | boolean      | NOT NULL, DEFAULT false                             | Is field required                          |
| `enabled`     | boolean      | NOT NULL, DEFAULT true                              | Is field active                            |
| `order`       | integer      | NOT NULL, DEFAULT 0                                 | Display order                              |
| `created_at`  | timestamptz  | NOT NULL, DEFAULT now()                             | Creation timestamp                         |
| `updated_at`  | timestamptz  | NOT NULL, DEFAULT now()                             | Last update timestamp                      |

**Indexes:**

- `custom_fields_project_id_idx` on `project_id`
- `custom_fields_project_id_order_idx` on `(project_id, order)`

---

### 6. `email_templates`

Email templates for campaigns

| Column       | Type         | Constraints                                         | Description                                          |
| ------------ | ------------ | --------------------------------------------------- | ---------------------------------------------------- |
| `id`         | uuid         | PRIMARY KEY, DEFAULT uuid_generate_v4()             | Template ID                                          |
| `project_id` | uuid         | NOT NULL, REFERENCES projects(id) ON DELETE CASCADE | Associated project                                   |
| `name`       | varchar(255) | NOT NULL                                            | Template name                                        |
| `subject`    | varchar(500) | NOT NULL                                            | Email subject line                                   |
| `body`       | text         | NOT NULL                                            | Email body (supports variables)                      |
| `type`       | varchar(50)  | NOT NULL                                            | Type: welcome, position-update, announcement, custom |
| `is_system`  | boolean      | NOT NULL, DEFAULT false                             | System template (cannot delete)                      |
| `created_at` | timestamptz  | NOT NULL, DEFAULT now()                             | Creation timestamp                                   |
| `updated_at` | timestamptz  | NOT NULL, DEFAULT now()                             | Last update timestamp                                |

**Indexes:**

- `email_templates_project_id_idx` on `project_id`
- `email_templates_type_idx` on `type`

---

### 7. `email_campaigns`

Email campaigns sent to waitlist

| Column             | Type         | Constraints                                         | Description                          |
| ------------------ | ------------ | --------------------------------------------------- | ------------------------------------ |
| `id`               | uuid         | PRIMARY KEY, DEFAULT uuid_generate_v4()             | Campaign ID                          |
| `project_id`       | uuid         | NOT NULL, REFERENCES projects(id) ON DELETE CASCADE | Associated project                   |
| `template_id`      | uuid         | REFERENCES email_templates(id) ON DELETE SET NULL   | Template used                        |
| `name`             | varchar(255) | NOT NULL                                            | Campaign name                        |
| `subject`          | varchar(500) | NOT NULL                                            | Email subject                        |
| `body`             | text         | NOT NULL                                            | Email body content                   |
| `status`           | varchar(20)  | NOT NULL, DEFAULT 'draft'                           | Status: draft, sending, sent, failed |
| `recipient_filter` | jsonb        |                                                     | Filter criteria for recipients       |
| `total_sent`       | integer      | NOT NULL, DEFAULT 0                                 | Total emails sent                    |
| `total_opened`     | integer      | NOT NULL, DEFAULT 0                                 | Total opened                         |
| `total_clicked`    | integer      | NOT NULL, DEFAULT 0                                 | Total clicked                        |
| `scheduled_at`     | timestamptz  |                                                     | Scheduled send time                  |
| `sent_at`          | timestamptz  |                                                     | Actual send time                     |
| `created_at`       | timestamptz  | NOT NULL, DEFAULT now()                             | Creation timestamp                   |
| `updated_at`       | timestamptz  | NOT NULL, DEFAULT now()                             | Last update timestamp                |

**Indexes:**

- `email_campaigns_project_id_idx` on `project_id`
- `email_campaigns_status_idx` on `status`
- `email_campaigns_sent_at_idx` on `sent_at`

---

### 8. `email_events`

Email tracking events (opens, clicks)

| Column        | Type         | Constraints                                                 | Description                                |
| ------------- | ------------ | ----------------------------------------------------------- | ------------------------------------------ |
| `id`          | uuid         | PRIMARY KEY, DEFAULT uuid_generate_v4()                     | Event ID                                   |
| `campaign_id` | uuid         | NOT NULL, REFERENCES email_campaigns(id) ON DELETE CASCADE  | Associated campaign                        |
| `entry_id`    | uuid         | NOT NULL, REFERENCES waitlist_entries(id) ON DELETE CASCADE | Recipient entry                            |
| `event_type`  | varchar(20)  | NOT NULL                                                    | Event: sent, opened, clicked, bounced      |
| `email`       | varchar(255) | NOT NULL                                                    | Recipient email                            |
| `metadata`    | jsonb        |                                                             | Additional event data (link clicked, etc.) |
| `created_at`  | timestamptz  | NOT NULL, DEFAULT now()                                     | Event timestamp                            |

**Indexes:**

- `email_events_campaign_id_idx` on `campaign_id`
- `email_events_entry_id_idx` on `entry_id`
- `email_events_event_type_idx` on `event_type`
- `email_events_created_at_idx` on `created_at`

---

### 9. `analytics_events`

User analytics and tracking events

| Column       | Type         | Constraints                                         | Description                              |
| ------------ | ------------ | --------------------------------------------------- | ---------------------------------------- |
| `id`         | uuid         | PRIMARY KEY, DEFAULT uuid_generate_v4()             | Event ID                                 |
| `project_id` | uuid         | NOT NULL, REFERENCES projects(id) ON DELETE CASCADE | Associated project                       |
| `entry_id`   | uuid         | REFERENCES waitlist_entries(id) ON DELETE SET NULL  | Related entry (if applicable)            |
| `event_type` | varchar(50)  | NOT NULL                                            | Event: signup, page_view, referral, etc. |
| `source`     | varchar(100) |                                                     | Traffic source                           |
| `metadata`   | jsonb        |                                                     | Additional event data                    |
| `created_at` | timestamptz  | NOT NULL, DEFAULT now()                             | Event timestamp                          |

**Indexes:**

- `analytics_events_project_id_idx` on `project_id`
- `analytics_events_event_type_idx` on `event_type`
- `analytics_events_created_at_idx` on `created_at`
- `analytics_events_project_id_created_at_idx` on `(project_id, created_at)`

---

### 10. `webhooks`

Webhook configurations for integrations

| Column              | Type         | Constraints                                         | Description                     |
| ------------------- | ------------ | --------------------------------------------------- | ------------------------------- |
| `id`                | uuid         | PRIMARY KEY, DEFAULT uuid_generate_v4()             | Webhook ID                      |
| `project_id`        | uuid         | NOT NULL, REFERENCES projects(id) ON DELETE CASCADE | Associated project              |
| `url`               | text         | NOT NULL                                            | Webhook URL                     |
| `events`            | text[]       | NOT NULL                                            | Array of event types to trigger |
| `secret`            | varchar(255) |                                                     | Webhook secret for verification |
| `enabled`           | boolean      | NOT NULL, DEFAULT true                              | Is webhook active               |
| `last_triggered_at` | timestamptz  |                                                     | Last trigger timestamp          |
| `created_at`        | timestamptz  | NOT NULL, DEFAULT now()                             | Creation timestamp              |
| `updated_at`        | timestamptz  | NOT NULL, DEFAULT now()                             | Last update timestamp           |

**Indexes:**

- `webhooks_project_id_idx` on `project_id`
- `webhooks_enabled_idx` on `enabled`

---

### 11. `api_keys`

API keys for project access

| Column         | Type         | Constraints                                         | Description                      |
| -------------- | ------------ | --------------------------------------------------- | -------------------------------- |
| `id`           | uuid         | PRIMARY KEY, DEFAULT uuid_generate_v4()             | Key ID                           |
| `project_id`   | uuid         | NOT NULL, REFERENCES projects(id) ON DELETE CASCADE | Associated project               |
| `key`          | varchar(255) | NOT NULL, UNIQUE                                    | API key (hashed)                 |
| `name`         | varchar(255) | NOT NULL                                            | Key name/description             |
| `permissions`  | text[]       | NOT NULL, DEFAULT '{read}'                          | Permissions: read, write, delete |
| `last_used_at` | timestamptz  |                                                     | Last usage timestamp             |
| `expires_at`   | timestamptz  |                                                     | Expiration timestamp             |
| `created_at`   | timestamptz  | NOT NULL, DEFAULT now()                             | Creation timestamp               |

**Indexes:**

- `api_keys_project_id_idx` on `project_id`
- `api_keys_key_idx` on `key`

---

## Relationships

```
profiles (1) ──< (many) projects
    │
    └── Supabase Auth users

projects (1) ──< (many) waitlist_entries
    │
    ├──< (many) embed_configurations (1:1)
    │
    ├──< (many) custom_fields
    │
    ├──< (many) email_templates
    │
    ├──< (many) email_campaigns
    │
    ├──< (many) analytics_events
    │
    ├──< (many) webhooks
    │
    └──< (many) api_keys

waitlist_entries (1) ──< (many) email_events
    │
    ├──< (many) analytics_events
    │
    └──< (self-referencing) waitlist_entries (referrals)

email_campaigns (1) ──< (many) email_events

email_templates (1) ──< (many) email_campaigns
```

---

## Row Level Security (RLS) Policies

### `profiles`

- Users can read/update their own profile
- Users cannot delete profiles

### `projects`

- Users can create projects
- Users can read/update/delete their own projects only

### `waitlist_entries`

- Public can create entries (signup)
- Project owners can read/update/delete entries in their projects
- Entries can read their own data via public API

### `embed_configurations`

- Public can read configurations (for widget rendering)
- Project owners can create/update/delete configurations

### `custom_fields`

- Public can read enabled fields (for form rendering)
- Project owners can create/update/delete fields

### `email_templates`

- Project owners can read/create/update/delete templates
- Cannot delete system templates

### `email_campaigns`

- Project owners can read/create/update/delete campaigns

### `email_events`

- Project owners can read events
- System can create events (service role)

### `analytics_events`

- Public can create events (tracking)
- Project owners can read events

### `webhooks`

- Project owners can create/update/delete webhooks
- System can read/update for triggering

### `api_keys`

- Project owners can create/read/delete API keys
- Keys themselves are hashed in database

---

## Database Functions & Triggers

### 1. Update `updated_at` timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
```

### 2. Update project total_signups counter

```sql
CREATE OR REPLACE FUNCTION update_project_signups()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE projects
        SET total_signups = total_signups + 1
        WHERE id = NEW.project_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE projects
        SET total_signups = total_signups - 1
        WHERE id = OLD.project_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';
```

### 3. Auto-assign waitlist position

```sql
CREATE OR REPLACE FUNCTION assign_waitlist_position()
RETURNS TRIGGER AS $$
BEGIN
    SELECT COALESCE(MAX(position), 0) + 1
    INTO NEW.position
    FROM waitlist_entries
    WHERE project_id = NEW.project_id;
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### 4. Generate referral code

```sql
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.referral_code = substring(md5(random()::text) from 1 for 8);
    RETURN NEW;
END;
$$ language 'plpgsql';
```

---

## Indexes for Performance

All foreign key relationships have indexes created automatically.

Additional composite indexes for common queries:

- `waitlist_entries` on `(project_id, created_at DESC)` for recent signups
- `email_events` on `(campaign_id, event_type)` for campaign stats
- `analytics_events` on `(project_id, event_type, created_at)` for analytics queries

---

## Storage Buckets (Supabase Storage)

### `logos`

- Store project logos and branding images
- Public read access
- Authenticated write access for project owners
- Max file size: 2MB
- Allowed types: image/jpeg, image/png, image/svg+xml

---

## Notes

1. **Supabase Auth Integration**: The `profiles` table links to Supabase's built-in `auth.users` table using a trigger on user signup.

2. **Email Variables**: Email templates support variables like `{{name}}`, `{{position}}`, `{{waitlist_name}}` which get replaced during sending.

3. **Custom Fields**: Stored as JSONB in `waitlist_entries.custom_fields` for flexibility.

4. **Referral Tracking**: Self-referencing relationship in `waitlist_entries` via `referred_by` field.

5. **Email Tracking**: Uses unique tracking pixels and links to log opens/clicks in `email_events`.

6. **Analytics**: Events are logged to `analytics_events` for dashboard reporting.

7. **API Keys**: Hashed before storage, never store plain text keys.

8. **Cascade Deletes**: Properly configured to clean up related data when projects are deleted.
