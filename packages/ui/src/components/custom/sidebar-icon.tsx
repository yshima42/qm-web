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
        'flex items-center gap-4 rounded-lg px-4 py-3 transition-colors',
        active
          ? 'bg-accent font-semibold text-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
        !showLabel && 'justify-center px-2',
      )}
      title={label}
      onClick={onClick}
    >
      <Icon size={showLabel ? 20 : 24} strokeWidth={active ? 2.5 : 2} className="transition-all" />
      {showLabel && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}
