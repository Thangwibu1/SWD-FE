import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { NavLink, Outlet } from 'react-router-dom';
import { NAV_ITEMS } from '../../app/router';

const DRAWER_WIDTH = 220;

export function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{ width: DRAWER_WIDTH, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        <Toolbar>
          <Typography variant="h6" component="span">
            Arch Eval
          </Typography>
        </Toolbar>
        <nav aria-label="Main navigation">
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItemButton key={item.path} component={NavLink} to={item.path} end>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </nav>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
