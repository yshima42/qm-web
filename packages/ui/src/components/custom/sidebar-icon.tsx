import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '../../../../utils/src/lib/utils';

type SidebarIconProps = {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  showLabel?: boolean;
  onClick?: () => void;
};

export function SidebarIcon({
  icon: Icon,
  label,
  href,
  active = false,
  showLabel = true,
  onClick,
}: SidebarIconProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-4 rounded-md px-4 py-2 transition-colors',
        active
          ? 'bg-primary-light/10 font-semibold text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark'
          : 'text-muted-foreground hover:bg-primary-light/10 hover:font-medium hover:text-primary-light dark:hover:bg-primary-dark/10 dark:hover:text-primary-dark',
        !showLabel && 'justify-center px-2',
      )}
      title={label}
      onClick={onClick}
    >
      <Icon size={showLabel ? 18 : 24} strokeWidth={active ? 2.5 : 2} className="transition-all" />
      {showLabel && <span>{label}</span>}
    </Link>
  );
}
