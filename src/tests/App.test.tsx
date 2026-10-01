import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../app/App';

describe('App scaffold', () => {
  it('renders the sidebar with every spec page', () => {
    render(<App initialPath="/" />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    for (const label of [
      'Dashboard',
      'New Experiment',
      'Experiments',
      'Comparison',
      'Architectures',
      'Settings',
    ]) {
      expect(nav).toHaveTextContent(label);
    }
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
  });

  it('navigates between pages', async () => {
    render(<App initialPath="/" />);
    await userEvent.click(screen.getByRole('link', { name: 'Architectures' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Architectures' })).toBeInTheDocument();
  });
});
