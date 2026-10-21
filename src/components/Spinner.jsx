export default function Spinner({ fullScreen = false }) {
  const spinner = <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />;
  if (!fullScreen) return spinner;
  return <div className="flex min-h-screen items-center justify-center">{spinner}</div>;
}
