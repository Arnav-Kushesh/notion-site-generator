export const dummySiteInfo = [
  { field: 'site_title', value: 'My Notion Portfolio' },
  { field: 'site_description', value: 'A portfolio site built with Next.js and Notion.' },
  { field: 'favicon', value: '', media: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png' }, // Placeholder favicon
  { field: 'keywords', value: 'portfolio, notion, nextjs' },
  { field: 'og_image', value: '', media: 'https://placehold.co/1200x630/png' },
  { field: 'sidebar_navigation', value: 'false' },
  { field: 'default_color_mode', value: 'light' },
];


export const dummyHero = [
  { field: 'tagline', value: 'Welcome to my portfolio based on Notion.' },
  { field: 'long_bio', value: 'This is a longer bio paragraph about yourself.' },
  { field: 'profile_image', value: '', media: 'https://placedog.net/500' },
  { field: 'location', value: 'San Francisco, CA' },
  { field: 'email', value: 'hello@example.com' },
  { field: 'twitter', value: 'https://twitter.com' },
  { field: 'github', value: 'https://github.com' },
  { field: 'linkedin', value: 'https://linkedin.com' },
  { field: 'instagram', value: 'https://instagram.com' },
  { field: 'youtube', value: 'https://youtube.com' },
  { field: 'facebook', value: 'https://facebook.com' },
  { field: 'twitch', value: 'https://twitch.tv' },
];

export const dummyProjectConfig = [
  { field: 'title', value: 'My Projects' },
  { field: 'show_section', value: 'true' },
  { field: 'view_type', value: 'Grid' },
];

export const dummyBlogConfig = [
  { field: 'title', value: 'Latest Writings' },
  { field: 'show_section', value: 'true' },
  { field: 'view_type', value: 'List' },
  { field: 'show_images', value: 'true' },
];

export const dummyGalleryConfig = [
  { field: 'title', value: 'Gallery' },
  { field: 'show_section', value: 'true' },
];

export const dummyProjects = {
  'Work in Progress': [
    {
      title: 'Notion Portfolio',
      slug: 'notion-portfolio',
      description: 'A static site generated from Notion.',
      tools: 'Next.js, Notion API',
      link: 'https://github.com',
      image: 'https://placedog.net/800/600',
    },
    {
      title: 'AI Chatbot',
      slug: 'ai-chatbot',
      description: 'A conversational AI interface.',
      tools: 'Python, OpenAI, React',
      link: 'https://github.com',
      image: 'https://placedog.net/801/600',
    }
  ],
  'Live': [
    {
      title: 'Cool App',
      slug: 'cool-app',
      description: 'A live application.',
      tools: 'React, Node.js',
      link: 'https://example.com',
      image: 'https://placedog.net/800/600',
      content: [
        { type: 'paragraph', content: 'This is a description of the Cool App project. It was built using modern technologies.' },
        { type: 'heading_2', content: 'Key Features' },
        { type: 'bullet_list_item', content: 'Real-time updates' },
        { type: 'bullet_list_item', content: 'Responsive design' },
        { type: 'bullet_list_item', content: 'Dark mode support' },
        { type: 'heading_2', content: 'Code Snippet' },
        { type: 'paragraph', content: 'Here is how we initialized the app:' },
        { type: 'code', content: "const app = new App();\napp.start();", language: "javascript" },
        { type: 'image', url: 'https://placedog.net/800/400', caption: 'App Architecture' }
      ]
    },
    {
      title: 'E-commerce Platform',
      slug: 'ecommerce-platform',
      description: 'A full-stack shopping platform.',
      tools: 'Next.js, Stripe, PostgreSQL',
      link: 'https://example.com/shop',
      image: 'https://placedog.net/802/600',
      content: [
        { type: 'paragraph', content: 'A robust e-commerce solution built for scale.' },
        { type: 'heading_2', content: 'Tech Stack' },
        { type: 'paragraph', content: 'We used Next.js for the frontend and Node.js for the backend.' }
      ]
    }
  ],
  'Abandoned': [],
};

const date = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const dummyBlogs = {
  'Live': [
    {
      title: 'Hello World',
      slug: 'hello-world',
      description: 'This is a sample blog post.',
      date: date,
      coverImage: 'https://placedog.net/1000/600',
      content: [
        { type: 'paragraph', content: 'Welcome to my first blog post! In this post, I will share my journey.' },
        { type: 'heading_2', content: 'Getting Started' },
        { type: 'paragraph', content: 'The first step was setting up the environment. It was straightforward.' },
        { type: 'image', url: 'https://placedog.net/1000/500', caption: 'My workspace setup' },
        { type: 'heading_3', content: 'Challenges Faced' },
        { type: 'bullet_list_item', content: 'Understanding the API' },
        { type: 'bullet_list_item', content: 'Fixing bugs' },
        { type: 'quote', content: '“The limit does not exist.” - Cady Heron' },
        { type: 'heading_2', content: 'Conclusion' },
        { type: 'paragraph', content: 'Thanks for reading! Stay tuned for more.' }
      ],
    },
    {
      title: 'The Future of Web Dev',
      slug: 'web-dev-future',
      description: 'Thoughts on where the industry is heading.',
      date: yesterday,
      coverImage: 'https://placedog.net/1001/600',
      content: [
        { type: 'paragraph', content: 'Web development is changing rapidly.' },
        { type: 'heading_2', content: 'AI and Coding' },
        { type: 'paragraph', content: 'AI tools are becoming essential counterparts.' }
      ]
    }
  ],
  'Drafts': [],
  'In Review': [],
  'Archive': [],
};

export const dummyGalleryItems = [
  {
    name: 'Mountain View',
    slug: 'mountain-view',
    image: 'https://placedog.net/600/600',
    link: 'https://unsplash.com',
    order: 1,
    content: [
      { type: 'heading_2', content: 'About this Shot' },
      { type: 'paragraph', content: 'I took this photo while hiking in the mountains. The air was crisp and fresh.' },
      { type: 'bullet_list_item', content: 'Camera: Sony A7III' },
      { type: 'bullet_list_item', content: 'Lens: 24-70mm GM' },
      { type: 'bullet_list_item', content: 'ISO: 100' },
      { type: 'quote', content: 'Nature is not a place to visit. It is home.' }
    ]
  },
  {
    name: 'City Lights',
    slug: 'city-lights',
    image: 'https://placedog.net/601/601',
    link: '',
    order: 2,
    content: [
      { type: 'heading_2', content: 'Urban Exploration' },
      { type: 'paragraph', content: 'The city comes alive at night.' }
    ]
  },
  {
    name: 'Ocean Waves',
    slug: 'ocean-waves',
    image: 'https://placedog.net/602/602',
    link: '',
    order: 3,
    content: [
      { type: 'heading_2', content: 'Serenity' },
      { type: 'paragraph', content: 'The sound of the waves is meditative.' }
    ]
  },
  {
    name: 'Forest Path',
    slug: 'forest-path',
    image: 'https://placedog.net/603/603',
    link: '',
    order: 4,
    content: [
      { type: 'heading_2', content: 'Into the Woods' },
      { type: 'paragraph', content: 'A quiet walk in the forest.' }
    ]
  },
  {
    name: 'Desert Dunes',
    slug: 'desert-dunes',
    image: 'https://placedog.net/604/604',
    link: '',
    order: 5,
    content: [
      { type: 'heading_2', content: 'Golden Sands' },
      { type: 'paragraph', content: 'The desert is vast and beautiful.' }
    ]
  },
  {
    name: 'Starry Night',
    slug: 'starry-night',
    image: 'https://placedog.net/605/605',
    link: '',
    order: 6,
    content: [
      { type: 'heading_2', content: 'Stargazing' },
      { type: 'paragraph', content: 'Looking up at the infinite universe.' }
    ]
  }
];
