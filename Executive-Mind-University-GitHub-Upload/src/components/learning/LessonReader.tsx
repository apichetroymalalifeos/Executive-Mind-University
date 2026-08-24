import type { LessonContent } from '../../content/lessons/lessonTypes';

interface LessonReaderProps {
  lesson: LessonContent;
  currentSectionId: string;
  completedSectionIds: string[];
  onSectionChange: (sectionId: string) => void;
  onSectionComplete: (sectionId: string) => void;
}

export function LessonReader({
  lesson,
  currentSectionId,
  completedSectionIds,
  onSectionChange,
  onSectionComplete
}: LessonReaderProps) {
  const currentIndex = Math.max(
    lesson.sections.findIndex((section) => section.id === currentSectionId),
    0
  );
  const section = lesson.sections[currentIndex] ?? lesson.sections[0];
  if (!section) {
    return null;
  }
  const previous = lesson.sections[currentIndex - 1];
  const next = lesson.sections[currentIndex + 1];
  const completed = new Set(completedSectionIds);

  return (
    <section className="lesson-reader" aria-labelledby="lesson-reader-title">
      <div className="section-heading">
        <p className="eyebrow">ตัวอ่านบทเรียน</p>
        <h2 id="lesson-reader-title">{section.title}</h2>
        <p>
          {section.estimatedMinutes} นาที | Section {currentIndex + 1} / {lesson.sections.length}
        </p>
      </div>

      <div className="section-nav" aria-label="รายการ section ของบทเรียน">
        {lesson.sections.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={item.id === section.id ? 'section-chip active' : 'section-chip'}
            onClick={() => onSectionChange(item.id)}
            aria-pressed={item.id === section.id}
          >
            {completed.has(item.id) ? '✓ ' : ''}
            {index + 1}
          </button>
        ))}
      </div>

      <article className="lesson-section-card">
        <p>{section.content}</p>
        <div className="takeaway-box">
          <strong>ใจความสำคัญ</strong>
          <span>{section.keyTakeaway}</span>
        </div>
      </article>

      <div className="reader-actions">
        <button
          type="button"
          className="secondary-action"
          disabled={!previous}
          onClick={() => previous && onSectionChange(previous.id)}
        >
          ก่อนหน้า
        </button>
        <button type="button" className="primary-action" onClick={() => onSectionComplete(section.id)}>
          บันทึกว่าอ่าน section นี้แล้ว
        </button>
        <button
          type="button"
          className="secondary-action"
          disabled={!next}
          onClick={() => next && onSectionChange(next.id)}
        >
          ถัดไป
        </button>
      </div>
    </section>
  );
}
