import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, Typography, CircularProgress, Paper, Grid, Chip, 
  LinearProgress, Card, CardContent 
} from '@mui/material';
import { getExperiment, getExperimentResults } from '../app/api-client.js';

export function ExperimentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sseData, setSseData] = useState<any>(null);

  const { data: exp, isLoading: expLoading } = useQuery({
    queryKey: ['experiment', id],
    queryFn: () => getExperiment(id!),
    enabled: !!id,
  });

  const { data: results, isLoading: resLoading } = useQuery({
    queryKey: ['experimentResults', id],
    queryFn: () => getExperimentResults(id!),
    enabled: !!id && ['COMPLETED', 'FAILED'].includes(exp?.status || ''),
  });

  useEffect(() => {
    if (!id || ['COMPLETED', 'FAILED'].includes(exp?.status || '')) return;

    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'}/experiments/${id}/events`);
    
    eventSource.addEventListener('progress', (e) => {
      setSseData(JSON.parse(e.data));
    });

    eventSource.addEventListener('completed', () => {
      eventSource.close();
      window.location.reload(); // Quick way to fetch final data
    });

    eventSource.addEventListener('failed', () => {
      eventSource.close();
      window.location.reload();
    });

    return () => {
      eventSource.close();
    };
  }, [id, exp?.status]);

  if (expLoading) return <CircularProgress />;
  if (!exp) return <Typography>Experiment not found</Typography>;

  const currentStatus = sseData?.status || exp.status;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Experiment: {exp.name}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Metadata</Typography>
            <Typography><strong>Status:</strong> <Chip label={currentStatus} size="small" /></Typography>
            <Typography><strong>Workload:</strong> {exp.workload_profile}</Typography>
            <Typography><strong>Repetitions:</strong> {exp.repetitions}</Typography>
            <Typography><strong>Cost Catalog:</strong> {exp.cost_catalog_version}</Typography>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Progress</Typography>
            {sseData ? (
              <Box>
                <Typography gutterBottom>
                  {sseData.completedRuns + sseData.failedRuns} / {sseData.totalRuns} runs completed
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={((sseData.completedRuns + sseData.failedRuns) / sseData.totalRuns) * 100} 
                  sx={{ mb: 2 }}
                />
                {sseData.activeRunState && (
                  <Typography variant="body2" color="textSecondary">
                    Current stage: {sseData.activeRunState}
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography color="textSecondary">
                {['COMPLETED', 'FAILED'].includes(currentStatus) 
                  ? 'Experiment finished.' 
                  : 'Waiting for worker...'}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {results && results.results?.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>Run Results</Typography>
          {results.results.map((run: any) => (
            <Card key={run.runId} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Run #{run.runNumber} - {run.loadRps} RPS</Typography>
                
                {run.gates && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Hard Gates</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {run.gates.gates.map((g: any) => (
                        <Chip 
                          key={g.code} 
                          label={`${g.code}: ${g.passed ? 'PASS' : 'FAIL'}`} 
                          color={g.passed ? 'success' : 'error'} 
                          size="small" 
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {run.metrics && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Metrics</Typography>
                    <Typography variant="body2" component="pre" sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                      {JSON.stringify({
                        p99Ms: run.metrics.p99Ms,
                        errorRate: run.metrics.errorRate,
                        cpuEfficiency: run.metrics.cpuEfficiency,
                        memoryPeakMiB: run.metrics.memoryPeakMiB
                      }, null, 2)}
                    </Typography>
                  </Box>
                )}

                {run.scores && (
                  <Box>
                    <Typography variant="subtitle2">
                      Weighted Score: {run.scores.weightedUtility ?? 'N/A'}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
