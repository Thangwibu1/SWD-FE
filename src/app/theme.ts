import { createTheme } from '@mui/material/styles';

/**
 * Status colours are fixed by the spec (section 26.1):
 * green = completed/pass, blue = running, yellow = pending/warning,
 * red = failed/infeasible, gray = cancelled/unknown.
 */
export const STATUS_COLORS = {
  success: '#2e7d32',
  running: '#1565c0',
  warning: '#f9a825',
  error: '#c62828',
  neutral: '#757575',
} as const;

export const theme = createTheme({
  palette: {
    mode: 'light',
    success: { main: STATUS_COLORS.success },
    info: { main: STATUS_COLORS.running },
    warning: { main: STATUS_COLORS.warning },
    error: { main: STATUS_COLORS.error },
  },
  shape: { borderRadius: 8 },
});
