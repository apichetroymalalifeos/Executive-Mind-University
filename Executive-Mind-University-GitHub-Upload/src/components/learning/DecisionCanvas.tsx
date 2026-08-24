import { useEffect, useMemo, useRef, useState } from 'react';
import type { DecisionCanvasResponse, ExerciseRecord } from '../../domain/entities/appData';
import { createEmptyDecisionCanvas } from '../../infrastructure/storage/defaultData';

interface DecisionCanvasProps {
  exercise: ExerciseRecord | null;
  onSave: (fields: DecisionCanvasResponse, complete: boolean) => void;
  onClear: () => void;
}

const fields: Array<{ key: keyof DecisionCanvasResponse; label: string; required?: boolean }> = [
  { key: 'decisionTitle', label: 'ชื่อการตัดสินใจ', required: true },
  { key: 'realProblem', label: 'ปัญหาจริงคืออะไร', required: true },
  { key: 'desiredOutcome', label: 'ผลลัพธ์ที่ต้องการ' },
  { key: 'facts', label: 'Fact ที่รู้แน่', required: true },
  { key: 'assumptions', label: 'Assumption ที่กำลังสมมติ', required: true },
  { key: 'opinions', label: 'Opinion หรือความเห็นส่วนตัว' },
  { key: 'unknowns', label: 'สิ่งที่ยังไม่รู้' },
  { key: 'constraints', label: 'ข้อจำกัด' },
  { key: 'options', label: 'ทางเลือก' },
  { key: 'reversibility', label: 'ตัดสินใจแล้วถอยกลับได้หรือไม่ได้' },
  { key: 'firstOrderEffects', label: 'ผลกระทบขั้นแรก' },
  { key: 'secondOrderEffects', label: 'ผลกระทบขั้นสอง' },
  { key: 'bestCase', label: 'กรณีดีที่สุด' },
  { key: 'baseCase', label: 'กรณีปกติที่น่าจะเกิด' },
  { key: 'worstCase', label: 'กรณีแย่ที่สุด' },
  { key: 'probabilityEstimate', label: 'ประเมินความน่าจะเป็น' },
  { key: 'riskMitigation', label: 'วิธีลดความเสี่ยง' },
  { key: 'decision', label: 'การตัดสินใจ' },
  { key: 'confidenceScore', label: 'คะแนนความมั่นใจ' },
  { key: 'nextActionWithin24Hours', label: 'Action ภายใน 24 ชั่วโมง', required: true },
  { key: 'reviewDate', label: 'วันที่จะกลับมาทบทวน' },
  { key: 'whatWouldChangeMyMind', label: 'อะไรจะทำให้ฉันเปลี่ยนใจ' }
];

export function DecisionCanvas({ exercise, onSave, onClear }: DecisionCanvasProps) {
  const [draft, setDraft] = useState<DecisionCanvasResponse>(exercise?.fields ?? createEmptyDecisionCanvas());
  const [saveStatus, setSaveStatus] = useState('draft พร้อมแล้ว');
  const lastSavedDraft = useRef(JSON.stringify(exercise?.fields ?? createEmptyDecisionCanvas()));

  useEffect(() => {
    const nextDraft = exercise?.fields ?? createEmptyDecisionCanvas();
    setDraft(nextDraft);
    lastSavedDraft.current = JSON.stringify(nextDraft);
  }, [exercise?.fields, exercise?.id, exercise?.updatedAt]);

  useEffect(() => {
    const serialized = JSON.stringify(draft);
    if (serialized === lastSavedDraft.current) {
      return undefined;
    }
    const timeout = window.setTimeout(() => {
      onSave(draft, false);
      lastSavedDraft.current = serialized;
      setSaveStatus('บันทึกอัตโนมัติแล้ว');
    }, 650);
    setSaveStatus('กำลังแก้ไข...');
    return () => window.clearTimeout(timeout);
  }, [draft, onSave]);

  const missingRequired = useMemo(
    () => fields.filter((field) => field.required && !draft[field.key].trim()).map((field) => field.label),
    [draft]
  );

  function updateField(key: keyof DecisionCanvasResponse, value: string): void {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function clear(): void {
    if (window.confirm('ล้าง draft ของ Decision Canvas ตอนนี้หรือไม่?')) {
      setDraft(createEmptyDecisionCanvas());
      onClear();
      setSaveStatus('ล้าง draft แล้ว');
    }
  }

  return (
    <section className="focus-block" aria-labelledby="exercise-title">
      <div className="section-heading">
        <p className="eyebrow">แบบฝึกหัดประจำวัน</p>
        <h3 id="exercise-title">Decision Canvas</h3>
        <p>กรอกเฉพาะช่องที่จำเป็นก่อน แล้วค่อยเพิ่มรายละเอียดภายหลัง</p>
      </div>
      <div className="form-grid">
        {fields.map((field) => (
          <label key={field.key} className="field-label">
            {field.label}
            {field.required ? ' *' : ''}
            <textarea
              rows={field.key === 'decisionTitle' || field.key === 'confidenceScore' || field.key === 'reviewDate' ? 2 : 4}
              value={draft[field.key]}
              onChange={(event) => updateField(field.key, event.target.value)}
            />
          </label>
        ))}
      </div>
      {missingRequired.length > 0 ? (
        <p className="empty-note">ต้องกรอกก่อนบันทึกว่าเสร็จ: {missingRequired.join(', ')}</p>
      ) : null}
      <div className="reader-actions">
        <button type="button" className="primary-action" onClick={() => onSave(draft, true)} disabled={missingRequired.length > 0}>
          บันทึกว่าแบบฝึกหัดเสร็จแล้ว
        </button>
        <button type="button" className="secondary-action" onClick={() => onSave(draft, false)}>
          บันทึกเอง
        </button>
        <button type="button" className="danger-action" onClick={clear}>
          ล้างฟอร์ม
        </button>
      </div>
      <p className="status-note" role="status">
        {saveStatus}
      </p>
    </section>
  );
}
