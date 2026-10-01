import { createBrowserRouter, createMemoryRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { PlaceholderPage } from '../pages/PlaceholderPage';

// Phase 0 scaffold: real pages replace placeholders in Phase 9.
export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard' },
  { path: '/experiments/new', label: 'New Experiment' },
  { path: '/experiments', label: 'Experiments' },
  { path: '/comparison', label: 'Comparison' },
  { path: '/architectures', label: 'Architectures' },
  { path: '/settings', label: 'Settings' },
] as const;

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: NAV_ITEMS.map((item) => ({
      ...(item.path === '/' ? { index: true } : { path: item.path.slice(1) }),
      element: <PlaceholderPage title={item.label} />,
    })),
  },
];

/** Memory router when an initial path is given (tests), browser router otherwise. */
export function createAppRouter(initialPath?: string) {
  return initialPath
    ? createMemoryRouter(routes, { initialEntries: [initialPath] })
    : createBrowserRouter(routes);
}
