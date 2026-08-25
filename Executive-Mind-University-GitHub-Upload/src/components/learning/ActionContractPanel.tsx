import { useEffect, useMemo, useState } from 'react';
import type { ActionContract } from '../../domain/entities/appData';

interface ActionContractPanelProps {
  contract: ActionContract | null;
  onSave: (
    input: Omit<ActionContract, 'id' | 'lessonId' | 'completedAt' | 'updatedAt'> & {
      id?: string;
      completedAt?: string | null;
    }
  ) => void;
  onStatusChange: (actionId: string, status: ActionContract['status'], outcomeReview?: string) => void;
}

export function ActionContractPanel({ contract, onSave, onStatusChange }: ActionContractPanelProps) {
  const [draft, setDraft] = useState({
    id: contract?.id,
    what: contract?.what ?? '',
    whyItMatters: contract?.whyItMatters ?? '',
    when: contract?.when ?? 'วันนี้',
    minimumAcceptableAction: contract?.minimumAcceptableAction ?? '',
    evidenceOfCompletion: contract?.evidenceOfCompletion ?? '',
    reviewDate: contract?.reviewDate ?? '',
    status: contract?.status ?? 'planned',
    outcomeReview: contract?.outcomeReview ?? null
  });
  const [outcomeReview, setOutcomeReview] = useState(contract?.outcomeReview ?? '');

  useEffect(() => {
    setDraft({
      id: contract?.id,
      what: contract?.what ?? '',
      whyItMatters: contract?.whyItMatters ?? '',
      when: contract?.when ?? 'วันนี้',
      minimumAcceptableAction: contract?.minimumAcceptableAction ?? '',
      evidenceOfCompletion: contract?.evidenceOfCompletion ?? '',
      reviewDate: contract?.reviewDate ?? '',
      status: contract?.status ?? 'planned',
      outcomeReview: contract?.outcomeReview ?? null
    });
    setOutcomeReview(contract?.outcomeReview ?? '');
  }, [
    contract?.evidenceOfCompletion,
    contract?.id,
    contract?.minimumAcceptableAction,
    contract?.outcomeReview,
    contract?.reviewDate,
    contract?.status,
    contract?.updatedAt,
    contract?.what,
    contract?.when,
    contract?.whyItMatters
  ]);
  const missingRequired = useMemo(() => {
    const missing: string[] = [];
    if (!draft.what.trim()) {
      missing.push('Action ที่จะทำ');
    }
    if (!draft.when.trim()) {
      missing.push('จะทำเมื่อไร');
    }
    if (!draft.minimumAcceptableAction.trim()) {
      missing.push('เวอร์ชันเล็กที่สุดที่นับว่าได้ลงมือ');
    }
    if (!draft.evidenceOfCompletion.trim()) {
      missing.push('หลักฐานว่าเสร็จ');
    }
    return missing;
  }, [draft.evidenceOfCompletion, draft.minimumAcceptableAction, draft.what, draft.when]);

  function update(key: keyof typeof draft, value: string): void {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function save(): void {
    onSave(draft.id ? draft : withoutUndefinedId(draft));
  }

  return (
    <section className="focus-block" aria-labelledby="action-title">
      <div className="section-heading">
        <p className="eyebrow">Action Contract</p>
        <h3 id="action-title">หนึ่ง action ภายใน 24 ชั่วโมง</h3>
        <p>สถานะ: {contract?.status ?? 'ยังไม่ได้สร้าง'}</p>
      </div>
      <div className="form-grid compact">
        <label className="field-label">
          Action ที่จะทำ
          <textarea rows={3} value={draft.what} onChange={(event) => update('what', event.target.value)} />
        </label>
        <label className="field-label">
          ทำไมเรื่องนี้สำคัญ
          <textarea rows={3} value={draft.whyItMatters} onChange={(event) => update('whyItMatters', event.target.value)} />
        </label>
        <label className="field-label">
          จะทำเมื่อไร
          <textarea rows={2} value={draft.when} onChange={(event) => update('when', event.target.value)} />
        </label>
        <label className="field-label">
          เวอร์ชันเล็กที่สุดที่นับว่าได้ลงมือ
          <textarea rows={2} value={draft.minimumAcceptableAction} onChange={(event) => update('minimumAcceptableAction', event.target.value)} />
        </label>
        <label className="field-label">
          หลักฐานว่าเสร็จ
          <textarea rows={2} value={draft.evidenceOfCompletion} onChange={(event) => update('evidenceOfCompletion', event.target.value)} />
        </label>
        <label className="field-label">
          วันที่ทบทวน
          <textarea rows={2} value={draft.reviewDate} onChange={(event) => update('reviewDate', event.target.value)} />
        </label>
      </div>
      {missingRequired.length > 0 ? (
        <p className="empty-note">ต้องกรอกก่อนบันทึก action จริง: {missingRequired.join(', ')}</p>
      ) : null}
      <div className="reader-actions">
        <button type="button" className="primary-action" onClick={save} disabled={missingRequired.length > 0}>
          บันทึก action
        </button>
        {contract ? (
          <button type="button" className="secondary-action" onClick={() => onStatusChange(contract.id, 'completed', outcomeReview)}>
            ทำเสร็จแล้ว
          </button>
        ) : null}
        {contract ? (
          <button type="button" className="secondary-action" onClick={() => onStatusChange(contract.id, 'postponed', outcomeReview)}>
            เลื่อน
          </button>
        ) : null}
        {contract ? (
          <button type="button" className="danger-action" onClick={() => onStatusChange(contract.id, 'skipped', outcomeReview)}>
            ข้าม
          </button>
        ) : null}
      </div>
      {contract ? (
        <label className="field-label">
          ทบทวนผลลัพธ์
          <textarea rows={3} value={outcomeReview} onChange={(event) => setOutcomeReview(event.target.value)} />
        </label>
      ) : null}
    </section>
  );
}

function withoutUndefinedId<T extends { id: string | undefined }>(value: T): Omit<T, 'id'> {
  const { id: omittedId, ...rest } = value;
  void omittedId;
  return rest;
}
