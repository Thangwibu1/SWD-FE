import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { createQueryClient } from './query-client';
import { createAppRouter } from './router';
import { theme } from './theme';

interface AppProps {
  queryClient?: QueryClient;
  initialPath?: string;
}

export function App({ queryClient, initialPath }: AppProps) {
  const [client] = useState(() => queryClient ?? createQueryClient());
  const [router] = useState(() => createAppRouter(initialPath));
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
