import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, Typography, CircularProgress, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, Button 
} from '@mui/material';
import { listExperiments } from '../app/api-client.js';

export function ExperimentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['experiments'],
    queryFn: () => listExperiments(),
    refetchInterval: 10000,
  });

  if (isLoading) return <CircularProgress />;

  const experiments = data?.experiments || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Experiments</Typography>
        <Button component={RouterLink} to="/experiments/new" variant="contained">
          New Experiment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Workload</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experiments.map((exp: any) => (
              <TableRow key={exp.id}>
                <TableCell sx={{ fontFamily: 'monospace' }}>{exp.id.split('-')[0]}</TableCell>
                <TableCell>{exp.name}</TableCell>
                <TableCell>{exp.workload_profile}</TableCell>
                <TableCell>
                  <Chip 
                    size="small" 
                    label={exp.status} 
                    color={exp.status === 'COMPLETED' ? 'success' : exp.status === 'FAILED' ? 'error' : 'primary'} 
                  />
                </TableCell>
                <TableCell>{new Date(exp.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Button component={RouterLink} to={`/experiments/${exp.id}`} size="small">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {experiments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No experiments found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
