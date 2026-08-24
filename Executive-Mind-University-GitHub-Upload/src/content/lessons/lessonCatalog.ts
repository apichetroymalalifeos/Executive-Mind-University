import type { LessonSummary } from '../../domain/entities/appData';
import { lesson1 } from './lesson1';

export const lessonCatalog: LessonSummary[] = [
  {
    id: lesson1.id,
    version: lesson1.version,
    titleEnglish: lesson1.titleEnglish,
    titleThai: lesson1.titleThai,
    facultyId: lesson1.facultyId,
    estimatedMinutes: lesson1.estimatedMinutes,
    difficulty: 'foundational',
    prerequisites: [],
    learningObjectives: lesson1.learningObjectives,
    futureSkillTags: [
      'Critical thinking',
      'Systems thinking',
      'Probabilistic thinking',
      'Long-term thinking'
    ],
    lastReviewedAt: '2026-07-18',
    nextReviewDueAt: '2026-08-18',
    freshnessStatus: 'current'
  }
];
