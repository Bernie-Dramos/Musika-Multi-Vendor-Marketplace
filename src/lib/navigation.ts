export type AppPage =
  | 'home'
  | 'services'
  | 'categories'
  | 'marketplace'
  | 'signin'
  | 'signup'
  | 'international-resources'
  | 'community-forum'
  | 'become-vendor'
  | 'help-support'
  | 'profile'
  | 'vendor-dashboard'
  | 'admin-dashboard'
  | 'my-posts'
  | 'saved-resources'
  | 'my-tickets'
  | 'notfound';

export type NavigablePage = Exclude<AppPage, 'notfound'>;

export const pageToPath: Record<NavigablePage, string> = {
  home: '/',
  services: '/services',
  categories: '/categories',
  marketplace: '/marketplace',
  signin: '/signin',
  signup: '/signup',
  'international-resources': '/international-resources',
  'community-forum': '/community-forum',
  'become-vendor': '/become-vendor',
  'help-support': '/help-support',
  profile: '/profile',
  'vendor-dashboard': '/vendor-dashboard',
  'admin-dashboard': '/admin-dashboard',
  'my-posts': '/my-posts',
  'saved-resources': '/saved-resources',
  'my-tickets': '/my-tickets',
};

const knownPathToPage: Record<string, NavigablePage> = {
  '/': 'home',
  '/services': 'services',
  '/categories': 'categories',
  '/marketplace': 'marketplace',
  '/signin': 'signin',
  '/signup': 'signup',
  '/international-resources': 'international-resources',
  '/community-forum': 'community-forum',
  '/become-vendor': 'become-vendor',
  '/help-support': 'help-support',
  '/profile': 'profile',
  '/vendor-dashboard': 'vendor-dashboard',
  '/admin-dashboard': 'admin-dashboard',
  '/my-posts': 'my-posts',
  '/saved-resources': 'saved-resources',
  '/my-tickets': 'my-tickets',
};

export const getPageFromPath = (pathname: string): AppPage => {
  const normalizedPath = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
  if (normalizedPath.startsWith('/international-resources/')) {
    return 'international-resources';
  }
  return knownPathToPage[normalizedPath] ?? 'notfound';
};

export const isNavigablePage = (value: string): value is NavigablePage => value in pageToPath;
