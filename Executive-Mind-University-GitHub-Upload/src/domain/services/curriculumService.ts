import { faculties } from '../../content/faculties';
import { lessonCatalog } from '../../content/lessons/lessonCatalog';
import type { AppDataEnvelope, Faculty, LessonSummary } from '../entities/appData';
import type { CurriculumEngine } from './engineContracts';

export class CurriculumService implements CurriculumEngine {
  listFaculties(): Faculty[] {
    return faculties;
  }

  listAvailableLessons(progress: AppDataEnvelope['curriculumProgress']): LessonSummary[] {
    const completed = new Set(progress.completedLessonIds);
    return lessonCatalog.filter((lesson) =>
      lesson.prerequisites.every((prerequisite) => completed.has(prerequisite))
    );
  }
}
