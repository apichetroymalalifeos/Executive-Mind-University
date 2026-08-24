import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import type { AppDataEnvelope } from '../domain/entities/appData';
import {
  dryRunImport,
  exportAppData,
  previewImport
} from '../infrastructure/importExport/importExportService';
import { STORAGE_ROOT_KEY } from '../domain/entities/appData';
import { createId } from '../utils/createId';

interface SettingsPageProps {
  data: AppDataEnvelope;
  onSave: (data: AppDataEnvelope) => void;
}

export function SettingsPage({ data, onSave }: SettingsPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importJson, setImportJson] = useState('');
  const [statusMessage, setStatusMessage] = useState('พร้อมดูแลข้อมูล local ของคุณ');

  const exportedJson = useMemo(() => exportAppData(data), [data]);
  const importPreview = useMemo(
    () => (importJson ? previewImport(importJson) : previewImport(exportedJson)),
    [exportedJson, importJson]
  );

  function persistCurrentData(): void {
    try {
      onSave({
        ...data,
        auditLog: [
          ...data.auditLog,
          {
            id: createId('audit'),
            action: 'manual_save',
            entityType: 'app_data',
            entityId: STORAGE_ROOT_KEY,
            createdAt: new Date().toISOString(),
            summary: 'Manual persistence check from Settings'
          }
        ]
      });
      setStatusMessage('บันทึกข้อมูลไว้ในเครื่องนี้แล้ว');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'บันทึกข้อมูลในเครื่องไม่สำเร็จ');
    }
  }

  function exportJsonFile(): void {
    const blob = new Blob([exportedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `executive-mind-university-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage('เตรียมไฟล์ backup JSON สำหรับดาวน์โหลดแล้ว');
  }

  function handleImportFile(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const rawText = typeof reader.result === 'string' ? reader.result : '';
      const preview = previewImport(rawText);
      setImportJson(rawText);
      setStatusMessage(
        preview.ok
          ? 'ไฟล์ import ใช้ได้ ตรวจ summary ก่อนแทนที่ข้อมูลปัจจุบัน'
          : `ปฏิเสธ import: ${preview.errors.join(', ')}`
      );
    };
    reader.onerror = () => {
      setStatusMessage('อ่านไฟล์ import ไม่สำเร็จ');
    };
    reader.readAsText(file);
  }

  function importCheckedData(): void {
    const dryRun = dryRunImport(data, importJson);
    if (!dryRun.ok || dryRun.data === null) {
      setStatusMessage(`ปฏิเสธ import: ${dryRun.errors.join(', ')}`);
      return;
    }

    const approved = window.confirm(
      'ต้องการแทนที่ข้อมูล Executive Mind University ปัจจุบันด้วยไฟล์ import ที่ตรวจแล้วหรือไม่? ถ้าต้องการเก็บข้อมูลเดิม ให้ export backup ก่อน'
    );
    if (!approved) {
      setStatusMessage('ยกเลิก import แล้ว ข้อมูลปัจจุบันไม่ถูกเปลี่ยน');
      return;
    }

    try {
      onSave({
        ...dryRun.data,
        auditLog: [
          ...dryRun.data.auditLog,
          {
            id: createId('audit'),
            action: 'import_applied',
            entityType: 'app_data',
            entityId: STORAGE_ROOT_KEY,
            createdAt: new Date().toISOString(),
            summary: 'Validated import replaced current local data'
          }
        ]
      });
      setImportJson('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setStatusMessage('Import สำเร็จ ข้อมูล local ถูกแทนที่ด้วยไฟล์ที่ตรวจแล้ว');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'บันทึกข้อมูล import ไม่สำเร็จ');
    }
  }

  return (
    <section className="page-stack" aria-labelledby="settings-title">
      <div className="section-heading">
        <p className="eyebrow">ควบคุมข้อมูลในเครื่อง</p>
        <h2 id="settings-title">ตั้งค่า</h2>
        <p>ข้อมูลถูกเก็บไว้บนเครื่องนี้ ควร export backup ก่อน import ไฟล์อื่น</p>
      </div>

      <div className="metric-grid">
        <div>
          <span>ขนาดไฟล์ export</span>
          <strong>{exportedJson.length}</strong>
        </div>
        <div>
          <span>สถานะ import preview</span>
          <strong>{importPreview.ok ? 'ใช้ได้' : 'ใช้ไม่ได้'}</strong>
        </div>
      </div>

      {importPreview.summary ? (
        <div className="focus-block">
          <p className="eyebrow">สรุปไฟล์ import</p>
          <div className="summary-grid">
            <span>Decision: {importPreview.summary.decisions}</span>
            <span>แบบฝึกหัด: {importPreview.summary.exercises}</span>
            <span>แหล่งข้อมูล: {importPreview.summary.knowledgeSources}</span>
            <span>Revision: {importPreview.summary.lessonRevisions}</span>
            <span>Scenario: {importPreview.summary.futureScenarios}</span>
          </div>
        </div>
      ) : null}

      {importPreview.errors.length > 0 ? (
        <div className="system-alert" role="alert">
          <strong>ไม่สามารถใช้ไฟล์ import นี้ได้</strong>
          <span>{importPreview.errors.join(', ')}</span>
        </div>
      ) : null}

      <div className="settings-actions">
        <button className="primary-action" type="button" onClick={persistCurrentData}>
          บันทึกข้อมูล local
        </button>
        <button className="secondary-action" type="button" onClick={exportJsonFile}>
          Export JSON
        </button>
        <label className="file-action">
          Import JSON
          <input
            ref={fileInputRef}
            accept="application/json,.json"
            type="file"
            onChange={handleImportFile}
          />
        </label>
        <button
          className="danger-action"
          disabled={!importJson || !importPreview.ok}
          type="button"
          onClick={importCheckedData}
        >
          Import ข้อมูลที่ตรวจแล้ว
        </button>
      </div>

      <p className="status-note" role="status">
        {statusMessage}
      </p>
    </section>
  );
}
