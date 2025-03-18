import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

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
          ? 'bg-accent/10 font-medium text-foreground'
          : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground',
        !showLabel && 'justify-center px-2',
      )}
      title={label}
      onClick={onClick}
    >
      <Icon size={18} />
      {showLabel && <span>{label}</span>}
    </Link>
  );
}
