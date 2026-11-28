export function Logo({ className = 'logo' }: { className?: string }) {
  return (
    <span className={className + ' wordmark'} aria-hidden="true">
      Na Linha
    </span>
  );
}
