import { cn } from '@/utils/helpers';

const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
};

// Reusable button. Usage: <Button variant="secondary" onClick={...}>Save</Button>
export default function Button({ variant = 'primary', loading = false, className, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}
