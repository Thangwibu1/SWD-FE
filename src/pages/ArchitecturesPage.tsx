import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, CircularProgress, Grid, Chip } from '@mui/material';
import { listArchitectures } from '../app/api-client.js';

export function ArchitecturesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['architectures'],
    queryFn: listArchitectures,
  });

  if (isLoading) return <CircularProgress />;

  const architectures = data?.architectures || [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Architecture Registry</Typography>
      <Typography color="textSecondary" gutterBottom sx={{ mb: 3 }}>
        Available architectures for evaluation in the design space.
      </Typography>

      <Grid container spacing={3}>
        {architectures.map((arch: any) => (
          <Grid size={{ xs: 12, md: 6 }} key={arch.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{arch.id}</Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label={arch.family} color="primary" size="small" sx={{ mr: 1, mb: 1 }} />
                  {arch.cache.enabled && <Chip label={`Cache: ${arch.cache.strategy}`} color="secondary" size="small" sx={{ mr: 1, mb: 1 }} />}
                  {arch.messaging.broker !== 'none' && <Chip label={`Messaging: ${arch.messaging.broker}`} color="info" size="small" sx={{ mr: 1, mb: 1 }} />}
                </Box>
                
                <Typography variant="subtitle2">Allowed Roles</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, mb: 2 }}>
                  {arch.allowedRoles.map((role: string) => (
                    <Chip key={role} label={role} size="small" variant="outlined" />
                  ))}
                </Box>
                
                <Typography variant="body2" color="textSecondary">
                  Communication: {arch.communication} | Scaling: {arch.scalingProfile}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
