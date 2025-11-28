"use client";

import { useEffect, useState } from "react";
import { StoryPostModal } from "@/features/stories/ui/story-post-modal";
import { HabitTileDto } from "@/lib/types";

type StoryModalProviderProps = {
  habits: HabitTileDto[];
  children: React.ReactNode;
};

export function StoryModalProvider({ habits, children }: StoryModalProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    window.addEventListener("openStoryModal", handleOpenModal);

    return () => {
      window.removeEventListener("openStoryModal", handleOpenModal);
    };
  }, []);

  return (
    <>
      {children}
      <StoryPostModal open={isModalOpen} onOpenChange={setIsModalOpen} habits={habits} />
    </>
  );
}
