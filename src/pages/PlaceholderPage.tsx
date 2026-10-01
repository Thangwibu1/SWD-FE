import Typography from '@mui/material/Typography';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary">
        This page will be implemented once the evaluator API is available.
      </Typography>
    </>
  );
}
