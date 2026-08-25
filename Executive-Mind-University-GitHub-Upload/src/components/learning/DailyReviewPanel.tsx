import { useEffect, useState } from 'react';
import type { DailyReviewEntry } from '../../domain/entities/appData';
import { LESSON_1_ID } from '../../content/lessons/lesson1';

interface DailyReviewPanelProps {
  review: DailyReviewEntry | null;
  actionContractId: string | null;
  onSave: (review: Omit<DailyReviewEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
}

export function DailyReviewPanel({ review, actionContractId, onSave }: DailyReviewPanelProps) {
  const [draft, setDraft] = useState({
    id: review?.id,
    whatDidILearn: review?.whatDidILearn ?? '',
    whatSurprisedMe: review?.whatSurprisedMe ?? '',
    whereCanIApplyThis: review?.whereCanIApplyThis ?? '',
    whatDecisionBecameClearer: review?.whatDecisionBecameClearer ?? '',
    whatWillIDoWithin24Hours: review?.whatWillIDoWithin24Hours ?? '',
    whatShouldIReviewLater: review?.whatShouldIReviewLater ?? ''
  });

  useEffect(() => {
    setDraft({
      id: review?.id,
      whatDidILearn: review?.whatDidILearn ?? '',
      whatSurprisedMe: review?.whatSurprisedMe ?? '',
      whereCanIApplyThis: review?.whereCanIApplyThis ?? '',
      whatDecisionBecameClearer: review?.whatDecisionBecameClearer ?? '',
      whatWillIDoWithin24Hours: review?.whatWillIDoWithin24Hours ?? '',
      whatShouldIReviewLater: review?.whatShouldIReviewLater ?? ''
    });
  }, [
    actionContractId,
    review?.id,
    review?.updatedAt,
    review?.whatDecisionBecameClearer,
    review?.whatDidILearn,
    review?.whatShouldIReviewLater,
    review?.whatSurprisedMe,
    review?.whatWillIDoWithin24Hours,
    review?.whereCanIApplyThis
  ]);

  function update(key: keyof typeof draft, value: string): void {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function save(status: DailyReviewEntry['status']): void {
    onSave({
      ...(draft.id ? draft : withoutUndefinedId(draft)),
      lessonId: LESSON_1_ID,
      actionContractId,
      status
    });
  }

  return (
    <section className="focus-block" aria-labelledby="daily-review-title">
      <div className="section-heading">
        <p className="eyebrow">ทบทวนประจำวัน</p>
        <h3 id="daily-review-title">รีวิวหลังเรียน</h3>
      </div>
      <div className="form-grid compact">
        <label className="field-label">
          วันนี้ฉันเรียนรู้อะไร
          <textarea rows={3} value={draft.whatDidILearn} onChange={(event) => update('whatDidILearn', event.target.value)} />
        </label>
        <label className="field-label">
          อะไรทำให้ฉันสะดุดคิด
          <textarea rows={3} value={draft.whatSurprisedMe} onChange={(event) => update('whatSurprisedMe', event.target.value)} />
        </label>
        <label className="field-label">
          จะเอาไปใช้ตรงไหนได้
          <textarea rows={3} value={draft.whereCanIApplyThis} onChange={(event) => update('whereCanIApplyThis', event.target.value)} />
        </label>
        <label className="field-label">
          การตัดสินใจเรื่องไหนชัดขึ้น
          <textarea rows={3} value={draft.whatDecisionBecameClearer} onChange={(event) => update('whatDecisionBecameClearer', event.target.value)} />
        </label>
        <label className="field-label">
          ฉันจะทำอะไรภายใน 24 ชั่วโมง
          <textarea rows={3} value={draft.whatWillIDoWithin24Hours} onChange={(event) => update('whatWillIDoWithin24Hours', event.target.value)} />
        </label>
        <label className="field-label">
          เรื่องใดควรกลับมาทบทวนภายหลัง
          <textarea rows={3} value={draft.whatShouldIReviewLater} onChange={(event) => update('whatShouldIReviewLater', event.target.value)} />
        </label>
      </div>
      <div className="reader-actions">
        <button type="button" className="secondary-action" onClick={() => save('draft')}>
          บันทึก draft
        </button>
        <button type="button" className="primary-action" onClick={() => save('completed')}>
          บันทึกรีวิวว่าเสร็จ
        </button>
      </div>
    </section>
  );
}

function withoutUndefinedId<T extends { id: string | undefined }>(value: T): Omit<T, 'id'> {
  const { id: omittedId, ...rest } = value;
  void omittedId;
  return rest;
}
