import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout.js';
import { PlaceholderPage } from '../pages/PlaceholderPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { ArchitecturesPage } from '../pages/ArchitecturesPage.js';
import { NewExperimentPage } from '../pages/NewExperimentPage.js';
import { ExperimentsPage } from '../pages/ExperimentsPage.js';
import { ExperimentDetailPage } from '../pages/ExperimentDetailPage.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'experiments/new',
        element: <NewExperimentPage />,
      },
      {
        path: 'experiments',
        element: <ExperimentsPage />,
      },
      {
        path: 'experiments/:id',
        element: <ExperimentDetailPage />,
      },
      {
        path: 'compare',
        element: <PlaceholderPage title="Compare Architectures" />,
      },
      {
        path: 'architectures',
        element: <ArchitecturesPage />,
      },
      {
        path: 'settings',
        element: <PlaceholderPage title="Settings" />,
      },
    ],
  },
]);
