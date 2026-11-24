import { LOGO_PATH } from '@/lib/logo';

export function Logo({ className = 'logo' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 2556 696" aria-hidden="true">
      <path fill="#fffae8" fillRule="evenodd" d={LOGO_PATH} />
    </svg>
  );
}
