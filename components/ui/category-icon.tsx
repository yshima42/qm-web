import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type CategoryIconProps = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  href?: string;
  showLabel?: boolean;
  onClick?: () => void;
};

export function CategoryIcon({
  icon: Icon,
  label,
  active = false,
  href,
  showLabel = true,
  onClick,
}: CategoryIconProps) {
  return (
    <Link
      href={href ?? '#'}
      className={cn(
        'flex items-center gap-4 rounded-full px-4 py-2 transition-colors',
        'hover:bg-accent/10',
        active && 'font-medium',
        !showLabel && 'justify-center px-2',
      )}
      title={label}
      onClick={onClick}
    >
      <Icon size={18} className="text-foreground" />
      {showLabel && <span>{label}</span>}
    </Link>
  );
}
