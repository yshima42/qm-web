'use client';

import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StoryCreateForm } from './story-create-form';
import { HabitTileDto } from '@/lib/types';

type StoryPostModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habits: HabitTileDto[];
};

export function StoryPostModal({ open, onOpenChange, habits }: StoryPostModalProps) {
  const t = useTranslations('story-post');
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('modalTitle')}</DialogTitle>
        </DialogHeader>
        <StoryCreateForm habits={habits} />
      </DialogContent>
    </Dialog>
  );
}
