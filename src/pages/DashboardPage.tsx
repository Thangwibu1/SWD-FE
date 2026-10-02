import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Grid, Typography, CircularProgress, Chip } from '@mui/material';
import { listExperiments, getHealth } from '../app/api-client.js';

export function DashboardPage() {
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: 30000,
  });

  const { data: exps, isLoading } = useQuery({
    queryKey: ['experiments', { limit: 5 }],
    queryFn: () => listExperiments({ limit: 5 }),
  });

  if (isLoading) return <CircularProgress />;

  const experiments = exps?.experiments || [];
  const total = exps?.total || 0;

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Evaluator API Status
              </Typography>
              <Typography variant="h5" component="div">
                {health?.status === 'ok' ? (
                  <Chip label="Online" color="success" />
                ) : (
                  <Chip label="Offline" color="error" />
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Experiments
              </Typography>
              <Typography variant="h4" component="div">
                {total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Worker Status
              </Typography>
              <Typography variant="h5" component="div">
                <Chip label="Ready" color="success" />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        Recent Experiments
      </Typography>
      {experiments.length === 0 ? (
        <Typography color="textSecondary">No experiments found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {experiments.map((exp: any) => (
            <Grid size={{ xs: 12 }} key={exp.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{exp.name}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip size="small" label={exp.status} color={exp.status === 'COMPLETED' ? 'success' : exp.status === 'FAILED' ? 'error' : 'primary'} />
                    <Chip size="small" label={exp.workload_profile} variant="outlined" />
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 'auto' }}>
                      {new Date(exp.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
