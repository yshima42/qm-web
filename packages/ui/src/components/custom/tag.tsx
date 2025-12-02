import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../../utils/src/lib/utils';

const tagVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors md:px-3 md:py-1 md:text-sm',
  {
    variants: {
      variant: {
        default: 'bg-muted text-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type TagProps = {} & React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof tagVariants>;

export function Tag({ className, variant, ...props }: TagProps) {
  return <span className={cn(tagVariants({ variant }), className)} {...props} />;
}
