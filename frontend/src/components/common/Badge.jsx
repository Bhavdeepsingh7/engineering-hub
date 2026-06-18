export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    brand: "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
