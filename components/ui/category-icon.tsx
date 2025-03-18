import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type CategoryIconProps = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  href?: string;
};

export function CategoryIcon({ icon: Icon, label, active = false, href }: CategoryIconProps) {
  return (
    <Link
      href={href ?? '#'}
      className={cn(
        'flex items-center gap-4 rounded-full px-4 py-2 transition-colors',
        'hover:bg-accent/10',
        active && 'font-medium',
      )}
    >
      <Icon size={18} className="text-foreground" />
      <span>{label}</span>
    </Link>
  );
}
