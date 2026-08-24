import { useEffect, useMemo, useState } from 'react';
import type { LessonSection } from '../../content/lessons/lessonTypes';
import { getSpeechSupportStatus } from '../../infrastructure/speech/speechSupport';

interface AudioModeProps {
  sections: LessonSection[];
  currentSectionId: string;
  speed: number;
  onSectionChange: (sectionId: string) => void;
  onSpeedChange: (speed: number) => void;
}

export function AudioMode({
  sections,
  currentSectionId,
  speed,
  onSectionChange,
  onSpeedChange
}: AudioModeProps) {
  const support = getSpeechSupportStatus();
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState(support.reason);
  const currentIndex = Math.max(
    sections.findIndex((section) => section.id === currentSectionId),
    0
  );
  const currentSection = sections[currentIndex];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < sections.length - 1;

  const utterance = useMemo(() => {
    if (!support.supported || !currentSection || typeof SpeechSynthesisUtterance === 'undefined') {
      return null;
    }
    const nextUtterance = new SpeechSynthesisUtterance(currentSection.audioText);
    nextUtterance.lang = 'th-TH';
    nextUtterance.rate = speed;
    nextUtterance.onend = () => {
      setIsPlaying(false);
      setMessage('ฟัง section นี้จบแล้ว');
    };
    nextUtterance.onerror = () => {
      setIsPlaying(false);
      setMessage('เสียงถูกขัดจังหวะ หรือ browser ไม่มีเสียงที่ใช้ได้');
    };
    return nextUtterance;
  }, [currentSection, speed, support.supported]);

  useEffect(() => {
    return () => {
      if (support.supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [support.supported]);

  function play(): void {
    if (!support.supported || utterance === null) {
      setMessage('อุปกรณ์นี้ยังไม่รองรับเสียงอ่านอัตโนมัติ ให้อ่าน section นี้บนหน้าจอแทน');
      return;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setMessage('กำลังเล่นเสียง section ปัจจุบัน');
  }

  function pause(): void {
    if (!support.supported) {
      return;
    }
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setMessage('หยุดชั่วคราว');
  }

  function resume(): void {
    if (!support.supported) {
      return;
    }
    window.speechSynthesis.resume();
    setIsPlaying(true);
    setMessage('เล่นต่อ');
  }

  function stop(): void {
    if (support.supported) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setMessage('หยุดเสียงแล้ว');
  }

  function move(delta: number): void {
    stop();
    const target = sections[currentIndex + delta];
    if (target) {
      onSectionChange(target.id);
    }
  }

  return (
    <section className="audio-panel" aria-labelledby="audio-title">
      <div>
        <p className="eyebrow">โหมดฟัง</p>
        <h3 id="audio-title">{currentSection?.title ?? 'ยังไม่ได้เลือก section'}</h3>
        <p className="driving-copy">ตั้งค่าก่อนออกรถ และไม่ควรกดหรือมองหน้าจอระหว่างขับรถ</p>
      </div>
      <p className="status-note" role="status">
        {message}
      </p>
      <div className="audio-controls">
        <button type="button" onClick={() => move(-1)} disabled={!canGoPrevious}>
          Section ก่อนหน้า
        </button>
        <button type="button" onClick={play}>
          เล่นเสียง
        </button>
        <button type="button" onClick={pause} disabled={!isPlaying}>
          หยุดชั่วคราว
        </button>
        <button type="button" onClick={resume}>
          เล่นต่อ
        </button>
        <button type="button" onClick={stop}>
          หยุด
        </button>
        <button type="button" onClick={() => move(1)} disabled={!canGoNext}>
          Section ถัดไป
        </button>
      </div>
      <label className="inline-field">
        ความเร็วเสียง
        <select value={speed} onChange={(event) => onSpeedChange(Number(event.target.value))}>
          <option value={0.85}>0.85x</option>
          <option value={1}>1x</option>
          <option value={1.15}>1.15x</option>
          <option value={1.3}>1.3x</option>
        </select>
      </label>
      <p className="empty-note">
        Section {currentIndex + 1} / {sections.length}
      </p>
    </section>
  );
}
