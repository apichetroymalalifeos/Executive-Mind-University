import { lesson1, LESSON_1_ID } from './lesson1';
import type { LessonContent } from './lessonTypes';

const lessons: Record<string, LessonContent> = {
  [LESSON_1_ID]: lesson1
};

export function getLessonById(lessonId: string): LessonContent | null {
  return lessons[lessonId] ?? null;
}

export function getPrimaryLesson(): LessonContent {
  return lesson1;
}
