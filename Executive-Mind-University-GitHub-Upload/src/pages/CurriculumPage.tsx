import { faculties } from '../content/faculties';
import { lessonCatalog } from '../content/lessons/lessonCatalog';
import type { CurriculumProgress } from '../domain/entities/appData';
import { calculateLessonCompletionRate } from '../domain/services/progressService';

interface CurriculumPageProps {
  progress: CurriculumProgress;
}

export function CurriculumPage({ progress }: CurriculumPageProps) {
  const completionRate = Math.round(calculateLessonCompletionRate(progress, lessonCatalog.length) * 100);

  return (
    <section className="page-stack" aria-labelledby="curriculum-title">
      <div className="section-heading">
        <p className="eyebrow">12 คณะความคิด</p>
        <h2 id="curriculum-title">ระบบหลักสูตร</h2>
        <p>เรียนจบแล้ว {completionRate}% จาก catalog เริ่มต้น</p>
      </div>
      <div className="faculty-list">
        {faculties.map((faculty) => (
          <article key={faculty.id}>
            <span>{faculty.titleEnglish}</span>
            <strong>{faculty.titleThai}</strong>
            <p>{faculty.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
