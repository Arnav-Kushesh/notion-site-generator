# Swan Documentation

Swan is a Notion-powered static site generator built with Next.js. It turns a Notion workspace into a fully functional portfolio/blog website with zero code changes required.

---

## Notion Page Structure

Swan expects the following structure in your Notion workspace:

```
Root Page
├── Home Page
│   ├── [Inline DB] Hero Section (info_section)
│   ├── [Inline DB] My Gallery (dynamic_section)
│   ├── [Inline DB] Selected Projects (dynamic_section)
│   ├── [Inline DB] Recent Writing (dynamic_section)
│   ├── [Inline DB] Custom HTML (html_section)
│   ├── [Inline DB] Embedded Page (iframe_section)
│   ├── [Inline DB] Featured Video (video_embed_section)
│   └── [Inline DB] Leave a Comment (mail_based_comment_section)
├── Navbar Pages
│   ├── About (page, can contain inline DB sections)
│   └── Contact (page, can contain inline DB sections)
├── Collections
│   ├── Gallery (database)
│   ├── Projects (database)
│   └── Blogs (database)
├── Settings
│   ├── General Configuration (database)
│   ├── Configure Collections (page)
│   │   ├── Gallery Settings (inline DB)
│   │   ├── Projects Settings (inline DB)
│   │   └── Blogs Settings (inline DB)
│   ├── HTML Head Code (page with code blocks)
│   ├── CSS Styling (page with code blocks)
│   └── Collection Page Extra Sections
│       ├── Gallery (page with inline DB sections)
│       ├── Projects (page with inline DB sections)
│       └── Blogs (page with inline DB sections)
└── Authors (database)
```

---

## Section Types

Sections are inline databases placed on the Home Page, Navbar Pages, or Collection Extra Sections pages. Each database must have a `section_type` select property to identify its type.

### 1. `info_section`

A static content section with text, image, and optional CTA button.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `description` | Rich Text | Section body text |
| `link` | URL | Optional CTA button link |
| `image` | Files | Optional hero/feature image |
| `view_type` | Select | Layout: `col_centered_view`, `col_left_view`, `row_view`, `row_reverse_view` |
| `section_type` | Select | Must be `info_section` |
| `enabled` | Checkbox | Show/hide the section |

### 2. `dynamic_section`

Displays items from a collection (blogs, projects, gallery) in various view types.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `collection_name` | Title | Name of the collection to display (e.g., "Blogs") |
| `section_title` | Rich Text | Display title for the section |
| `view_type` | Select | Layout: `list_view`, `card_view`, `grid_view`, `minimal_list_view` |
| `section_type` | Select | Must be `dynamic_section` |
| `enabled` | Checkbox | Show/hide the section |

### 3. `html_section`

Renders custom HTML inside a sandboxed iframe. The HTML code is stored as a code block inside the first database row's page content.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `section_type` | Select | Must be `html_section` |
| `enabled` | Checkbox | Show/hide the section |

**HTML Head Code:** Open the first row as a page, add a code block with your HTML.

### 4. `iframe_section`

Embeds an external webpage in an iframe.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `url` | URL | The URL to embed |
| `section_type` | Select | Must be `iframe_section` |
| `enabled` | Checkbox | Show/hide the section |

### 5. `video_embed_section`

Embeds a video (YouTube, Vimeo, etc.) using the embed URL.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `url` | URL | Video embed URL (e.g., `https://www.youtube.com/embed/VIDEO_ID`) |
| `section_type` | Select | Must be `video_embed_section` |
| `enabled` | Checkbox | Show/hide the section |

### 6. `mail_based_comment_section`

A simple email-based comment form using `mailto:` links.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `topic_title` | Title | Email subject line |
| `author_email` | Rich Text | Recipient email address |
| `section_type` | Select | Must be `mail_based_comment_section` |
| `enabled` | Checkbox | Show/hide the section |

---

## Collections

Collections are full-page databases stored under the "Collections" page. Each item in a collection has:

| Property | Type | Description |
|----------|------|-------------|
| `Title` | Title | Item title |
| `Description` | Rich Text | Short description |
| `Image` | Files | Cover/thumbnail image |
| `Tags` | Multi-select | Categorization tags |
| `Link` | URL | External link |
| `order_priority` | Number | Sort order (higher = first) |
| `author_username` | Rich Text | Author username (links to Authors DB) |
| `video_embed_link` | URL | Optional video embed URL |

The page content (body) of each item becomes the full article content, rendered as markdown.

---

## General Configuration

The "General Configuration" database in Settings stores site-wide settings as key-value pairs:

| Key | Description |
|-----|-------------|
| `title` | Site title |
| `tagline` | Site tagline/subtitle |
| `description` | Meta description |
| `logo` | Site logo (via Media field) |
| `favicon` | Favicon image (via Media field) |
| `og_image` | OpenGraph image (via Media field) |
| `keywords` | SEO keywords |
| `sidebar_navigation` | `true`/`false` - Enable sidebar by default |
| `disable_logo_in_topbar` | `true`/`false` |
| `disable_logo_in_sidebar` | `true`/`false` |
| `default_color_mode` | Default theme: `light`, `dark`, `blue`, `pink`, `red`, `green`, `brown`, `cream`, `rose` |
| `social_github` | GitHub profile URL |
| `social_twitter` | Twitter/X profile URL |
| `social_linkedin` | LinkedIn profile URL |
| `social_instagram` | Instagram profile URL |
| `social_youtube` | YouTube channel URL |
| `social_facebook` | Facebook profile URL |
| `social_twitch` | Twitch channel URL |
| `social_email` | Contact email |
| `enable_newsletter` | `true`/`false` - Enable newsletter functionality |
| `mailchimp_form_link` | Mailchimp form URL |
| `show_newsletter_section_on_home` | `true`/`false` |
| `mention_this_tool_in_footer` | `true`/`false` - Show "Built with Swan" in footer |

---

## Color Modes

Swan supports 9 color themes:

| Theme | Description |
|-------|-------------|
| `light` | Clean white/gray (default) |
| `dark` | Dark mode |
| `blue` | Midnight blue |
| `pink` | Berry pink/purple |
| `red` | Sunset red |
| `green` | Forest green |
| `brown` | Coffee brown |
| `cream` | Light cream/warm white |
| `rose` | Light pink |

Set the default via `default_color_mode` in General Configuration. Users can change themes via the Settings menu or the Experiment panel.

---

## Navigation Modes

Swan supports two navigation layouts:

- **Navbar (Top Bar):** Default. Shows logo, navigation links, social icons, settings, and search.
- **Sidebar (Left Panel):** Fixed left sidebar with profile, navigation, social icons, and settings.

Set the default via `sidebar_navigation` in General Configuration. Users can toggle via the Experiment panel (changes don't persist).

---

## Code & CSS Injection

- **HTML Head Code** page (under Settings): Add code blocks containing `<script>` tags or other HTML to inject into `<head>`.
- **CSS Styling** page (under Settings): Add code blocks containing CSS to inject as `<style>` tags in `<head>`.

---

## Authors

The Authors database stores author profiles:

| Property | Type | Description |
|----------|------|-------------|
| `name` | Title | Display name |
| `username` | Rich Text | Unique username (used to link posts to authors) |
| `email` | Email | Contact email |
| `description` | Rich Text | Bio |
| `picture` | Files | Profile picture |
| `instagram_handle` | Rich Text | Instagram username |
| `x_handle` | Rich Text | X/Twitter username |
| `github_handle` | Rich Text | GitHub username |

---

## Collection Page Extra Sections

Extra sections can be added to collection entry pages (blog posts, projects, etc.) via:

**Settings > Collection Page Extra Sections > [Collection Name]**

Each collection name page contains inline databases representing sections. These sections are rendered on every entry page of that collection, above the comment/email section.

All section types are supported (info, dynamic, html, iframe, video_embed, mail_based_comment).

---

## Navbar Page Sections

Navbar pages (About, Contact, etc.) can also contain inline database sections. Any inline database on a navbar page that has a `section_type` property will be rendered as a section below the page content.

---

## Experiment Panel

A floating "Experiment" button in the bottom-right corner opens a panel for trying out different settings:

- **Section Views:** Change the view type of any homepage section in real time
  - *Info sections:* `col_centered_view`, `col_left_view`, `row_view`, `row_reverse_view`
  - *Dynamic sections:* `list_view`, `card_view`, `grid_view`, `minimal_list_view`
- **Color Mode:** Switch between all 9 themes
- **Sidebar Toggle:** Enable/disable sidebar navigation

Changes made via the Experiment panel are **temporary** and will not persist after a page refresh. This is intentional for experimentation purposes.

---

## RSS Feeds

RSS feeds are auto-generated for collections with `enable_rss: true` in their collection settings. Access them at `/rss/[collection-name]`.

---

## Search

Swan includes a built-in search (Cmd+K / Ctrl+K) that searches across all collection items by title, description, collection name, and tags.

---

## Data Flow

```
Notion Workspace
    ↓ npm run sync
notion_state/ (local JSON + Markdown cache)
    ↓ npm run build
Static HTML/CSS/JS (Next.js static export)
```

1. **Sync:** Fetches all data from Notion API, downloads images, converts pages to markdown
2. **Build:** Next.js reads from `notion_state/` and generates a fully static site
3. **Deploy:** Upload the `out/` directory to any static hosting (Vercel, Netlify, GitHub Pages, etc.)
