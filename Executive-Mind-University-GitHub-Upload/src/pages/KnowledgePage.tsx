import type { KnowledgeSource, LessonRevision } from '../domain/entities/appData';

interface KnowledgePageProps {
  sources: KnowledgeSource[];
  revisions: LessonRevision[];
}

export function KnowledgePage({ sources, revisions }: KnowledgePageProps) {
  const draftRevisions = revisions.filter((revision) => revision.reviewStatus === 'draft');

  return (
    <section className="page-stack" aria-labelledby="knowledge-title">
      <div className="section-heading">
        <p className="eyebrow">ความรู้ใหม่ต้องผ่านการตรวจสอบ</p>
        <h2 id="knowledge-title">ศูนย์ความรู้</h2>
      </div>
      <div className="metric-grid">
        <div>
          <span>แหล่งข้อมูล</span>
          <strong>{sources.length}</strong>
        </div>
        <div>
          <span>draft update</span>
          <strong>{draftRevisions.length}</strong>
        </div>
        <div>
          <span>ประวัติ revision</span>
          <strong>{revisions.length}</strong>
        </div>
      </div>
      <p className="empty-note">ข้อมูล Tier D ห้ามใช้เป็นหลักฐานหลัก ระบบอนุมัติเนื้อหาใหม่จะเริ่มใน Phase 4</p>
    </section>
  );
}
