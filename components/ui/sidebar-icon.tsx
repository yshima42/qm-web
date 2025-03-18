import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type SidebarIconProps = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
};

export function SidebarIcon({
  icon: Icon,
  label,
  active = false,
  href,
  onClick,
}: SidebarIconProps) {
  const baseClasses = cn(
    'flex items-center gap-4 px-4 py-3 rounded-full transition-colors w-full',
    'hover:bg-accent/10',
    active && 'font-bold',
  );

  const content = (
    <>
      <Icon size={24} className={cn('text-foreground', active && 'stroke-[2px]')} />
      <span className="text-xl">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}
