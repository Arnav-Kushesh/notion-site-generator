
// Global Config Page Data
export const dummyConfig = [
  // Top Level
  { field: 'title', value: 'My Notion Portfolio' },
  { field: 'tagline', value: 'Software Engineer & Designer' },
  { field: 'logo', value: '', media: 'https://placehold.co/100' },
  { field: 'description', value: 'A portfolio site built with Next.js and Notion.' },

  // Socials
  { field: 'social_github', value: 'https://github.com' },
  { field: 'social_twitter', value: 'https://twitter.com' },
  { field: 'social_linkedin', value: 'https://linkedin.com' },
  { field: 'social_instagram', value: 'https://instagram.com' },
  { field: 'social_youtube', value: 'https://youtube.com' },
  { field: 'social_facebook', value: 'https://facebook.com' },
  { field: 'social_twitch', value: 'https://twitch.tv' },

  // Visibility Flags
  { field: 'disable_logo_in_topbar', value: 'false' },
  { field: 'disable_logo_in_sidebar', value: 'false' },
  // Sidebar
  { field: 'sidebar_navigation', value: 'false' },
  // Site Info
  { field: 'favicon', value: '', media: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png' },
  { field: 'keywords', value: 'portfolio, notion, nextjs' },
  { field: 'og_image', value: '', media: 'https://placehold.co/1200x630/png' },
];

/**
 * HOME PAGE SECTIONS
 * The Home Page will contain a list of Inline Databases.
 * We'll represent them here as objects that the script will create as DBs.
 */

// 1. Hero Section (Info Section)
export const dummyHeroSection = {
  type: 'info_section',
  title: 'Hero Section',
  data: [
    {
      title: 'Welcome to my portfolio',
      description: 'This is a longer bio paragraph about yourself. I build things with code.',
      link: 'https://example.com/about',
      image: 'https://placedog.net/500',
      view_type: 'col_centered_view',
    }
  ]
};

// 2. Dynamic Sections
export const dummyDynamicGallery = {
  type: 'dynamic_section',
  title: 'My Gallery',
  data: [
    {
      collection_name: 'Gallery',
      section_title: 'My Gallery',
      view_type: 'grid_view',
    }
  ]
};

export const dummyDynamicProjects = {
  type: 'dynamic_section',
  title: 'Selected Projects',
  data: [
    {
      collection_name: 'Projects',
      section_title: 'Selected Projects',
      view_type: 'card_view',
    }
  ]
};

export const dummyDynamicBlog = {
  type: 'dynamic_section',
  title: 'Recent Writing',
  data: [
    {
      collection_name: 'Blogs',
      section_title: 'Recent Writing',
      view_type: 'minimal_list_view', // Text only
    }
  ]
};

// The order here determines the order of creation on the Home Page, and thus the default order on the site.
export const dummyHomePageSections = [
  dummyHeroSection,
  dummyDynamicGallery,
  dummyDynamicProjects,
  dummyDynamicBlog
];

/**
 * COLLECTIONS
 * Stored in Root > Collections > [Page] > [Database]
 */

export const dummyCollections = {
  Gallery: [
    {
      title: 'Mountain View',
      description: 'I took this photo while hiking in the mountains.',
      image: 'https://images.unsplash.com/photo-1519681393798-38e36fefce15?w=600&h=600&fit=crop',
      tags: ['Nature', 'Photography'],
      link: 'https://unsplash.com',
      order: 1,
    },
    {
      title: 'City Lights',
      description: 'The city comes alive at night. A long exposure shot.',
      image: 'https://images.unsplash.com/photo-1542397284385-6010376c5337?w=600&h=601&fit=crop',
      tags: ['Urban', 'Night'],
      link: '',
      order: 2,
    },
    {
      title: 'Ocean Breeze',
      description: 'Calm waves hitting the shore during sunset.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=602&fit=crop',
      tags: ['Nature', 'Water'],
      link: '',
      order: 3,
    },
    {
      title: 'Forest Mist',
      description: 'Early morning mist rolling through the pine trees.',
      image: 'https://images.unsplash.com/photo-1448375240586-dfd8f3793371?w=600&h=603&fit=crop',
      tags: ['Nature', 'Forest'],
      link: '',
      order: 4,
    },
    {
      title: 'Desert Dunes',
      description: 'Layered sand dunes under the bright sun.',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&h=604&fit=crop',
      tags: ['Nature', 'Desert'],
      link: '',
      order: 5,
    },
    {
      title: 'Urban Architecture',
      description: 'Modern lines and glass facades.',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=605&fit=crop',
      tags: ['Architecture', 'Urban'],
      link: '',
      order: 6,
    }
  ],
  Projects: [
    {
      title: 'Notion Portfolio',
      description: 'A static site generated from Notion content, built with Next.js.',
      image: 'https://images.unsplash.com/photo-1507238691140-d94cf9536852?w=800&h=600&fit=crop',
      tags: ['Next.js', 'Notion API'],
      link: 'https://github.com',
      order: 1,
    },
    {
      title: 'AI Chatbot',
      description: 'A conversational AI interface using OpenAI API.',
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=601&fit=crop',
      tags: ['Python', 'OpenAI', 'React'],
      link: 'https://github.com',
      order: 2,
    },
    {
      title: 'E-commerce Store',
      description: 'Full-featured online store with Stripe integration.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800&h=602&fit=crop',
      tags: ['React', 'Stripe', 'Node.js'],
      link: 'https://github.com',
      order: 3,
    },
    {
      title: 'Task Manager',
      description: 'Productivity app to organize daily tasks and goals.',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=603&fit=crop',
      tags: ['Vue.js', 'Firebase'],
      link: 'https://github.com',
      order: 4,
    },
    {
      title: 'Weather App',
      description: 'Real-time weather forecasts using geolocation.',
      image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=604&fit=crop',
      tags: ['JavaScript', 'API'],
      link: 'https://github.com',
      order: 5,
    },
    {
      title: 'Finance Tracker',
      description: 'Track income and expenses with visual charts.',
      image: 'https://images.unsplash.com/photo-1554224155-984063581895?w=800&h=605&fit=crop',
      tags: ['React', 'D3.js'],
      link: 'https://github.com',
      order: 6,
    }
  ],
  Blogs: [
    {
      title: 'Hello World',
      description: 'Welcome to my first blog post! In this post, I will share my journey.',
      image: 'https://images.unsplash.com/photo-1499750310159-a52f3377a986?w=1000&h=600&fit=crop',
      tags: ['Personal', 'Update'],
      link: '',
      order: 1,
    },
    {
      title: 'The Future of Web Dev',
      description: 'Thoughts on where the industry is heading with AI and new frameworks.',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1001&h=600&fit=crop',
      tags: ['Tech', 'Opinion'],
      link: '',
      order: 2,
    },
    {
      title: 'Mastering CSS Grid',
      description: 'A comprehensive guide to building complex layouts with CSS Grid.',
      image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1002&h=600&fit=crop',
      tags: ['CSS', 'Tutorial'],
      link: '',
      order: 3,
    },
    {
      title: 'Why I Use Next.js',
      description: 'The benefits of server-side rendering and static site generation.',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1003&h=600&fit=crop',
      tags: ['Next.js', 'React'],
      link: '',
      order: 4,
    },
    {
      title: 'Remote Work Tips',
      description: 'How to stay productive and maintain a healthy work-life balance.',
      image: 'https://images.unsplash.com/photo-1593642532744-93771563d659?w=1004&h=600&fit=crop',
      tags: ['Productivity', 'Lifestyle'],
      link: '',
      order: 5,
    },
    {
      title: 'Learning Rust',
      description: 'My experience diving into systems programming with Rust.',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1005&h=600&fit=crop',
      tags: ['Rust', 'Programming'],
      link: '',
      order: 6,
    }
  ]
};

export const dummyNavbarPages = [
  {
    title: 'About',
    content: [
      { type: 'heading_1', content: 'About Me' },
      { type: 'paragraph', content: 'I am a passionate developer building open source projects.' },
    ]
  },
  {
    title: 'Contact',
    content: [
      { type: 'heading_1', content: 'Contact' },
      { type: 'paragraph', content: 'Reach out to me on social media.' },
    ]
  }
];
