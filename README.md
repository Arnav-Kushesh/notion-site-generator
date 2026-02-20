<div align="center">
<br/><br/>
<img alt="start-simple-logo" src="https://raw.githubusercontent.com/arnav-kushesh/swan/master/assets/swan.png" height="128"/>
<h3 style="margin-top: 9px;">Swan - Notion as a Website</h3>

<br/>

![Static Badge](https://img.shields.io/badge/DISCORD-JOIN-blue?style=for-the-badge&logo=discord&labelColor=black&color=%235965f2&link=https://discord.gg/aAsZqZkJKW)

</div>

Swan is a powerful **Notion-to-Website** engine that turns your Notion workspace into a high-performance, static website. Built with **Next.js**, **PandaCSS**, and the **Notion API**, it offers the simplicity of a CMS with the speed of a static site.

## ✨ Features

- **Notion as CMS**: Manage 100% of your content (posts, pages, config) in Notion.
- **Fast**: Static Site Generation (SSG) ensures instant page loads and perfect SEO.
- **Collections**: Create multiple content collections (blogs, projects, galleries) with different display views.
- **Global Search**: Built-in `Cmd+K` command palette to search all content.
- **Multi-Author**: Support for multiple authors with dedicated profile pages.
- **Rich Content**: Supports video embeds, code blocks, callouts, and more.
- **7 Section Types**: Info, Dynamic, HTML, Iframe, Video Embed, Newsletter, and Mail-Based Comment sections.
- **Newsletter Ready**: Native Mailchimp integration form with per-collection and per-page control.
- **Code & CSS Injection**: Add Analytics, Ads, or custom styles directly from Notion using html_section and "html head code" page in settings
- **8 Color Themes**: Light, Dark, Blue, Purple, Pink, Red, Green, and Cream.
- **Two Navigation Modes**: Top navbar or left sidebar — configurable from Notion.
- **RSS Feeds**: Auto-generated feeds for every content collection.
- **SEO Optimized**: Static generation with sitemap, meta tags, OpenGraph images, and keywords.
- **Unique Comment System**: Email-based commenting via `mailto` — no databases, no servers, no third-party scripts.
- **Content Freedom**: You own your content. No vendor lock-in, no monthly fees. Host anywhere for free.

---

## Use Cases

### Blog Site

Swan is a natural fit for blogging. Write your posts in Notion, tag and categorize them, assign authors, and publish as a fast static blog with RSS feeds and newsletter signups. No WordPress, no Substack — just Notion and a static site that you fully own.

### Startup Website

Use Swan to build your startup's website entirely from Notion. Create landing pages with `info_section` hero blocks, embed demo videos with `video_embed_section`, add a newsletter signup with `newsletter_section`, and inject your analytics and ad scripts via code injection. Your marketing team can update content in Notion without touching code, and every change goes live with a single rebuild.

### Portfolio Site

Showcase your work using Swan's collections and multiple view types (grid, card, list, minimal list). Create a Gallery for photography, a Projects collection for case studies, and a Blogs collection for writing — each with its own display style, RSS feed, and author attribution.

### Your Own YouTube Alternative

Host your videos on any platform (Vimeo, Bunny Stream, your own server) and embed them on your Swan site using the `video_embed_section` feature or the `video_embed_link` property on collection items. Unlike YouTube, **no one can censor or demonetize your content**. You control the entire experience — the page layout, the branding, the ads. Monetize freely by placing Google AdSense or any ad network script via `html_section` blocks right alongside your videos, or inject ad scripts globally via the HTML Head Code page. Your content, your platform, your revenue — without a middleman taking a cut or deciding what's allowed.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/arnav-kushesh/swan.git
cd swan
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the root directory:

```bash
NOTION_API_KEY=secret_your_notion_integration_key
ROOT_PAGE_ID=your_root_page_id
```

> **Tip**: obtain your API key from [Notion Integrations](https://www.notion.so/my-integrations) and share your root page with the integration.

### 3. Seed Notion (One-time Setup)

Run the seed script to automatically create the required database structure in your Notion page:

```bash
npm run seed
```

> **Note**: If you encounter broken images in your Notion workspace, run `npm run seed` again to update them with fresh placeholders.
> _This will create specific Pages and Databases (Home, Settings, Collections) in your root page._

### 4. Sync & Run

Download content from Notion and start the dev server:

```bash
npm run sync  # Fetches data to notion_state/
npm run dev   # Starts Next.js at localhost:3000
```

---

## 🛠️ Project Structure

```
swan/
├── app/                 # Next.js App Router pages
├── components/          # React UI components
├── lib/                 # Utilities & Data Fetching
├── scripts/             # Node.js scripts for Notion Sync
│   ├── lib/             # Seeding logic
│   └── sync-notion.mjs  # Main sync script
├── notion_state/        # Local cache of Notion content (JSON/MD)
├── public/              # Static assets & downloaded images
└── panda.config.mjs     # Design system configuration
```

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
│   ├── [Inline DB] Newsletter (newsletter_section)
│   └── [Inline DB] Leave a Comment (mail_based_comment_section)
├── Navbar Pages
│   ├── About (page, can contain inline DB sections)
│   └── Contact (page, can contain inline DB sections)
├── Collections
│   ├── Gallery (database)
│   ├── Projects (database)
│   └── Blogs (database)
├── Settings
│   ├── Main Configuration (database)
│   ├── General Configuration (database)
│   ├── Social Links (database)
│   ├── Configure Collections (database)
│   ├── Collection Page Extra Sections
│   │   ├── Gallery (page with inline DB sections)
│   │   ├── Projects (page with inline DB sections)
│   │   └── Blogs (page with inline DB sections)
│   ├── HTML Head Code (page with code blocks)
│   └── CSS Styling (page with code blocks)
└── Authors (database)
```

---

## Collections

Collections are full-page databases stored under the "Collections" page. Swan ships with three default collections — **Gallery**, **Projects**, and **Blogs** — but you can configure any number of them.

Each item in a collection has:

| Property           | Type         | Description                           |
| ------------------ | ------------ | ------------------------------------- |
| `Title`            | Title        | Item title                            |
| `Description`      | Rich Text    | Short description                     |
| `Image`            | Files        | Cover/thumbnail image                 |
| `Tags`             | Multi-select | Categorization tags                   |
| `Link`             | URL          | External link                         |
| `order_priority`   | Number       | Sort order (higher = first)           |
| `author_username`  | Rich Text    | Author username (links to Authors DB) |
| `video_embed_link` | URL          | Optional video embed URL              |

The page content (body) of each item becomes the full article content, rendered as markdown. You can write rich content using all of Notion's block types — headings, paragraphs, images, code blocks, callouts, quotes, bullet lists, numbered lists, toggle blocks, and more.

### Collection Settings

Per-collection configuration is managed in **Settings > Configure Collections**, a single database with one row per collection:

| Property                          | Type     | Description                                    |
| --------------------------------- | -------- | ---------------------------------------------- |
| `collection_name`                 | Title    | Name of the collection                         |
| `enable_rss`                      | Checkbox | Generate an RSS feed for this collection       |
| `show_newsletter_section`         | Checkbox | Show newsletter signup on collection pages     |
| `show_mail_based_comment_section` | Checkbox | Show email comment section on collection pages |

### Collection Page Extra Sections

Extra sections can be added to every entry page of a collection via **Settings > Collection Page Extra Sections > [Collection Name]**. Each collection has a dedicated page where you place inline database sections. These are rendered on every entry page of that collection, giving you the ability to add related content, CTAs, or ads to all posts.

All 7 section types are supported.

---

## Section Types

Sections are inline databases placed on the Home Page, Navbar Pages, or Collection Extra Sections pages. Each database must have a `section_type` select property to identify its type.

### 1. `info_section`

A static content section with text, image, and optional CTA button. Use it for hero sections, about blurbs, feature highlights, or any static content block.

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

Displays items from a collection (blogs, projects, gallery) in various view types. This is how you showcase your content on the homepage or any page.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `collection_name` | Title | Name of the collection to display (e.g., "Blogs") |
| `section_title` | Rich Text | Display title for the section |
| `view_type` | Select | Layout: `list_view`, `card_view`, `grid_view`, `minimal_list_view` |
| `section_type` | Select | Must be `dynamic_section` |
| `enabled` | Checkbox | Show/hide the section |

### 3. `html_section`

Renders custom HTML inside a sandboxed iframe. This is one of Swan's most powerful features — it lets you embed **anything** that can be expressed as HTML directly from Notion.

**Use cases:**

- **Ads**: Embed Google AdSense or any ad network script
- **Widgets**: Embed calendars, forms, social feeds, or third-party widgets
- **Custom UI**: Build custom interactive elements with HTML/CSS/JS
- **Embeds**: Any embed code that doesn't fit into an iframe URL

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `section_type` | Select | Must be `html_section` |
| `enabled` | Checkbox | Show/hide the section |

**How to add HTML:** Open the first row as a page in Notion, then add a code block with your HTML content.

### 4. `iframe_section`

Embeds an external webpage in an iframe. Use this to embed any website, tool, or service directly into your page.

**Use cases:**

- Embed a Typeform, Google Form, or Calendly widget
- Show a live demo or external tool
- Embed a Figma file, CodePen, or Google Map

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `url` | URL | The URL to embed |
| `section_type` | Select | Must be `iframe_section` |
| `enabled` | Checkbox | Show/hide the section |

### 5. `video_embed_section`

Embeds a video (YouTube, Vimeo, etc.) using the embed URL. Videos play inline on your site — viewers stay on your page instead of being redirected to YouTube.

**Use cases:**

- Feature a YouTube intro video on your homepage
- Embed tutorial or demo videos on project pages
- Create a video portfolio section

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | Title | Section heading |
| `url` | URL | Video embed URL (e.g., `https://www.youtube.com/embed/VIDEO_ID`) |
| `section_type` | Select | Must be `video_embed_section` |
| `enabled` | Checkbox | Show/hide the section |

### 6. `newsletter_section`

Renders a Mailchimp-powered newsletter signup form. This section reads the `mailchimp_form_link` from your General Configuration. Add it to the homepage, navbar pages, or collection extra sections.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `section_type` | Select | Must be `newsletter_section` |
| `enabled` | Checkbox | Show/hide the section |

### 7. `mail_based_comment_section`

A unique email-based comment system. When a reader clicks "comment", their email client opens with a pre-filled subject line, initiating a direct email thread with the author. No databases, no servers, no third-party comment scripts.

**Database Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `topic_title` | Title | Email subject line |
| `author_email` | Rich Text | Recipient email address |
| `section_type` | Select | Must be `mail_based_comment_section` |
| `enabled` | Checkbox | Show/hide the section |

---

## Configuration

Swan's configuration is split across three databases under the Settings page. This keeps concerns separated and makes each settings page focused and easy to manage.

### Main Configuration

The "Main Configuration" database stores your site's identity and branding. It has individual columns for each setting with a single row of data.

| Column               | Type      | Description                                                        |
| -------------------- | --------- | ------------------------------------------------------------------ |
| `title`              | Title     | Site title                                                         |
| `description`        | Rich Text | Meta description                                                   |
| `tagline`            | Rich Text | Site tagline/subtitle                                              |
| `keywords`           | Rich Text | SEO keywords                                                       |
| `logo`               | Files     | Site logo                                                          |
| `favicon`            | Files     | Favicon image                                                      |
| `og_image`           | Files     | OpenGraph image for social sharing                                 |
| `default_color_mode` | Select    | Default theme (light, dark, blue, purple, pink, red, green, cream) |
| `sidebar_navigation` | Checkbox  | Enable sidebar navigation by default                               |

### General Configuration

The "General Configuration" database stores feature flags and toggles. All boolean fields use checkboxes.

| Column                            | Type     | Description                               |
| --------------------------------- | -------- | ----------------------------------------- |
| `disable_logo_in_topbar`          | Checkbox | Hide logo from the top navbar             |
| `disable_logo_in_sidebar`         | Checkbox | Hide logo from the sidebar                |
| `enable_newsletter`               | Checkbox | Enable newsletter functionality site-wide |
| `mailchimp_form_link`             | URL      | Mailchimp form URL                        |
| `mention_this_tool_in_footer`     | Checkbox | Show "Built with Swan" in the footer      |
| `show_newsletter_section_on_home` | Checkbox | Show a newsletter section on the homepage |

### Social Links

The "Social Links" database stores your social media profiles and contact links. It has two columns — `name` and `data` — with one row per social link.

| Column | Type      | Description                                       |
| ------ | --------- | ------------------------------------------------- |
| `name` | Title     | Social platform name (e.g., `github`)             |
| `data` | Rich Text | Profile URL or contact info (e.g., email address) |

Supported social platforms: github, twitter, linkedin, instagram, youtube, facebook, twitch, email.

---

## 🎨 Design Customization

### Color Themes

Swan supports 8 color themes:

| Theme    | Type  | Description                |
| -------- | ----- | -------------------------- |
| `light`  | Light | Clean white/gray (default) |
| `cream`  | Light | Warm white/cream           |
| `pink`   | Light | Berry pink/purple          |
| `dark`   | Dark  | Dark mode                  |
| `blue`   | Dark  | Midnight blue              |
| `purple` | Dark  | Deep purple                |
| `red`    | Dark  | Sunset red                 |
| `green`  | Dark  | Forest green               |

Set the default via `default_color_mode` in Main Configuration. Users can switch themes via the Settings menu in the navbar/sidebar, and the choice persists in their browser's localStorage.

### Navigation Modes

Swan supports two navigation layouts:

- **Navbar (Top Bar):** Default. Shows logo, navigation links, social icons, settings, and search.
- **Sidebar (Left Panel):** Fixed left sidebar with profile, navigation, social icons, and settings.

Set the default via the `sidebar_navigation` checkbox in Main Configuration.

### CSS Injection

Add custom CSS directly from Notion via **Settings > CSS Styling**. Add code blocks containing CSS — they are injected as `<style>` tags in `<head>`. This lets you customize fonts, colors, layouts, or any aspect of the design without touching code.

### Themes CSS

Edit `app/themes.css` to customize the color variables for each theme. Global styles are in `app/globals.css`.

---

## Monetization & Ads

Swan gives you full control over monetization without any code changes:

- **Google AdSense / Ad Networks**: Add your ad scripts via **Settings > HTML Head Code** (code injection) or use an `html_section` to place ad units anywhere on your pages.
- **Affiliate Links**: Add affiliate links directly in your Notion content or in `html_section` blocks.
- **Sponsored Content**: No restrictions — you have full control over your content and layout.
- **Newsletter Monetization**: Use the built-in Mailchimp integration to build an email list.

Unlike platforms like Medium or Substack, Swan doesn't take a cut of anything. Your ads, your revenue, your content.

---

## Content Freedom

Swan is built on the principle that **you own your content**:

- **No vendor lock-in**: Your content lives in Notion and is synced as Markdown files. You can export it anytime.
- **No monthly fees**: Host on Vercel, Netlify, GitHub Pages, or any static host for free.
- **No restrictions**: Custom themes, code injection, custom HTML sections — no limitations on what you can build.
- **No middleman**: Direct email-based comments, your own ad scripts, your own analytics.
- **Full SEO control**: Meta descriptions, keywords, OpenGraph images, auto-generated sitemap — all managed from Notion.

---

## RSS Feeds

RSS feeds are auto-generated for collections with `enable_rss` checked in their collection settings (Configure Collections). Access them at `/rss/[collection-name]`.

This enables readers to subscribe to your content using any RSS reader (Feedly, Inoreader, etc.) and helps with content syndication.

---

## SEO

Swan is optimized for search engines out of the box:

- **Static Generation**: Every page is pre-rendered as static HTML, giving search engines clean, fast-loading content to crawl.
- **Auto-generated Sitemap**: A `sitemap.xml` is generated at build time covering all pages, collection items, and author profiles.
- **Meta Tags**: Title, description, and keywords are set from your Main Configuration and per-page properties.
- **OpenGraph Images**: Set a site-wide `og_image` in Main Configuration for social sharing previews.
- **Clean URLs**: SEO-friendly URLs like `/blogs/my-post-title` and `/author/username`.
- **RSS Feeds**: Search engines can discover your RSS feeds for indexing.

---

## Code Injection

- **HTML Head Code** page (under Settings): Add code blocks containing `<script>` tags or any HTML to inject into `<head>`. Use this for analytics (Google Analytics, Plausible, Fathom), ad scripts, custom meta tags, or any third-party integrations.
- **CSS Styling** page (under Settings): Add code blocks containing CSS to inject as `<style>` tags in `<head>`.

---

## Authors

The Authors database stores author profiles:

| Property           | Type      | Description                                     |
| ------------------ | --------- | ----------------------------------------------- |
| `name`             | Title     | Display name                                    |
| `username`         | Rich Text | Unique username (used to link posts to authors) |
| `email`            | Email     | Contact email                                   |
| `description`      | Rich Text | Bio                                             |
| `picture`          | Files     | Profile picture                                 |
| `instagram_handle` | Rich Text | Instagram username                              |
| `x_handle`         | Rich Text | X/Twitter username                              |
| `github_handle`    | Rich Text | GitHub username                                 |

Each author gets a profile page at `/author/{username}` that lists all their published work.

---

## Navbar Pages

Navbar pages (About, Contact, etc.) appear as links in the navigation. Each page can contain:

1. **Rich text content** written in Notion (headings, paragraphs, images, etc.)
2. **Inline database sections** — any section type can be added to a navbar page, rendered below the page content

To add a navbar page, create a new child page under "Navbar Pages" in Notion.

---

## Search

Swan includes a built-in search (Cmd+K / Ctrl+K) that searches across all collection items by title, description, collection name, and tags. The search index is built at compile time — no external search service required.

---

## Experiment Panel

A floating "Experiment" button in the bottom-right corner opens a panel for trying out different settings:

- **Section Views:** Change the view type of any homepage section in real time
  - _Info sections:_ `col_centered_view`, `col_left_view`, `row_view`, `row_reverse_view`
  - _Dynamic sections:_ `list_view`, `card_view`, `grid_view`, `minimal_list_view`
- **Color Mode:** Switch between all 8 themes
- **Sidebar Toggle:** Enable/disable sidebar navigation

Changes made via the Experiment panel are **temporary** and will not persist after a page refresh.

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

---

## 📦 Deployment

Swan is designed for static hosting.

### Vercel / Netlify

1. Connect your GitHub repository.
2. Set Environment Variables (`NOTION_API_KEY`, `ROOT_PAGE_ID`) in the dashboard.
3. Set the **Build Command**:
   ```bash
   npm run sync-and-build
   ```
4. Set the **Output Directory**: `out`

### 🔄 Updating Content from Notion

Since Swan is a Static Site Generator (SSG), changes in Notion do NOT appear automatically. You must **trigger a fresh build** (or redeploy) in your hosting dashboard (Netlify/Vercel) to fetch and render new content.

---

## 🤝 Contributing

Contributions are welcome!.

## 📄 License

MIT © [Arnav Kushesh](https://github.com/arnav-kushesh)
