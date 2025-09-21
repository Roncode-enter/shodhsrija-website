
export const API_ENDPOINTS = {
  // Core
  TEAM: '/api/core/team/',
  DEPARTMENTS: '/api/core/departments/',
  FOCUS_AREAS: '/api/core/focus-areas/',
  IMPACT_STORIES: '/api/core/impact-stories/',
  SITE_STATS: '/api/core/site-stats/',
  CONTACT: '/api/core/contact/',
  HOMEPAGE_DATA: '/api/core/homepage-data/',

  // Research
  PUBLICATIONS: '/api/research/publications/',
  RESEARCH_PROJECTS: '/api/research/projects/',

  // Membership
  MEMBERSHIP_TIERS: '/api/membership/tiers/',
  MEMBERSHIP_APPLY: '/api/membership/apply/',
  PAYMENT_CREATE: '/api/membership/payment/create/',
  PAYMENT_VERIFY: '/api/membership/payment/verify/',

  // Donations
  DONATIONS_CREATE: '/api/donations/create-order/',
  DONATIONS_VERIFY: '/api/donations/verify-payment/',

  // Issues
  ISSUE_CATEGORIES: '/api/issues/categories/',
  REPORT_ISSUE: '/api/issues/report/',
};

export const MEMBERSHIP_TIERS = {
  STUDENT: 'student',
  VOLUNTEER: 'volunteer',
  RESEARCHER: 'researcher',
  INSTITUTIONAL: 'institutional',
};

export const THEMES = {
  MORNING: 'morning',
  EVENING: 'evening',
  NIGHT: 'night',
};

export const CONTACT_SUBJECTS = {
  GENERAL: 'general',
  COLLABORATION: 'collaboration',
  MEDIA: 'media',
  SUPPORT: 'support',
  OTHER: 'other',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const DONATION_TYPES = {
  ONE_TIME: 'one_time',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

export const RAZORPAY_CONFIG = {
  KEY_ID: process.env.REACT_APP_RAZORPAY_KEY_ID,
  CURRENCY: 'INR',
  THEME_COLOR: '#2563eb',
};

export const APP_CONFIG = {
  SITE_NAME: 'ShodhSrija Foundation',
  SITE_TAGLINE: 'Youth Innovation for Societal Change',
  CONTACT_EMAIL: 'info@shodhsrija.org',
  PHONE: '+91-XXXXX-XXXXX',
  ADDRESS: 'New Delhi, India',

  SOCIAL_LINKS: {
    TWITTER: '#',
    LINKEDIN: '#',
    FACEBOOK: '#',
    INSTAGRAM: '#',
  },

  SEO: {
    DEFAULT_TITLE: 'ShodhSrija Foundation - Youth Innovation for Societal Change',
    DEFAULT_DESCRIPTION: 'Empowering young minds to research, innovate, and create sustainable solutions for Indias most pressing challenges.',
    KEYWORDS: 'NGO, research, innovation, youth, social change, India, community development',
  },
};
