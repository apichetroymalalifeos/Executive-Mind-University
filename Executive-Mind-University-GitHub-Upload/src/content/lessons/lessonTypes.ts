import type { QuizQuestion } from '../../domain/entities/appData';

export interface LessonSection {
  id: string;
  title: string;
  estimatedMinutes: number;
  content: string;
  audioText: string;
  keyTakeaway: string;
}

export interface LessonContent {
  id: string;
  lessonNumber: number;
  version: number;
  titleEnglish: string;
  titleThai: string;
  facultyId: string;
  facultyTitle: string;
  estimatedMinutes: number;
  whyItMatters: string;
  recommendedApplicationArea: string;
  learningObjectives: string[];
  sections: LessonSection[];
  quiz: QuizQuestion[];
}
