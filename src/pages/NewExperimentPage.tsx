import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Stepper, Step, StepLabel, Button, Typography, TextField, 
  Paper, Alert, CircularProgress 
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { validateCandidate, createExperiment } from '../app/api-client.js';

const steps = ['Input Candidate', 'Validate', 'Configure & Run'];

export function NewExperimentPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [candidateJsonStr, setCandidateJsonStr] = useState('');
  const [candidateObj, setCandidateObj] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  
  const validateMutation = useMutation({
    mutationFn: validateCandidate,
    onSuccess: (data) => setValidationResult(data),
    onError: (err: any) => setValidationResult({ valid: false, errors: [err.message] })
  });
  
  const createMutation = useMutation({
    mutationFn: (payload: any) => createExperiment(payload, crypto.randomUUID()),
    onSuccess: (data) => navigate(`/experiments/${data.experimentId}`)
  });

  const handleNext = () => {
    if (activeStep === 0) {
      try {
        const obj = JSON.parse(candidateJsonStr);
        setCandidateObj(obj);
        validateMutation.mutate(obj);
        setActiveStep(1);
      } catch (err) {
        alert('Invalid JSON');
      }
    } else if (activeStep === 1) {
      if (validationResult?.valid) setActiveStep(2);
    }
  };

  const handleRun = () => {
    createMutation.mutate({
      name: `Exp - ${candidateObj.architectureId} - ${new Date().toISOString().split('T')[0]}`,
      candidate: candidateObj,
      workloadProfile: 'MIXED_V1',
      loadLevelsRps: [25],
      slo: { p99Ms: 100, errorRateMax: 0.01 },
      costCatalogVersion: 'research-v1',
      repetitions: 1
    });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>New Experiment</Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 3 }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>Paste Candidate JSON</Typography>
            <TextField
              fullWidth
              multiline
              rows={15}
              value={candidateJsonStr}
              onChange={(e) => setCandidateJsonStr(e.target.value)}
              placeholder='{ "candidateId": "...", "architectureId": "A01", ... }'
              variant="outlined"
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            {validateMutation.isPending ? (
              <CircularProgress />
            ) : validationResult?.valid ? (
              <Alert severity="success">
                Candidate is valid! Architecture: {validationResult.architectureId}
              </Alert>
            ) : (
              <Alert severity="error">
                Validation failed:
                <pre>{JSON.stringify(validationResult?.errors, null, 2)}</pre>
              </Alert>
            )}
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>Experiment Configuration</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Default settings (MIXED_V1, 25 RPS, 1 Repetition) will be used for this pilot.
            </Alert>
            <TextField fullWidth disabled label="Workload" value="MIXED_V1" sx={{ mb: 2 }} />
            <TextField fullWidth disabled label="Load Level (RPS)" value="25" sx={{ mb: 2 }} />
            <TextField fullWidth disabled label="Cost Catalog" value="research-v1" sx={{ mb: 2 }} />
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prev) => prev - 1)}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleRun} variant="contained" disabled={createMutation.isPending}>
            {createMutation.isPending ? <CircularProgress size={24} /> : 'Run Experiment'}
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained" disabled={activeStep === 1 && !validationResult?.valid}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
}
