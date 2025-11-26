'use client';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Story</DialogTitle>
        </DialogHeader>
        <StoryCreateForm habits={habits} />
      </DialogContent>
    </Dialog>
  );
}
