export interface SpeechSupportStatus {
  supported: boolean;
  reason: string;
}

export function getSpeechSupportStatus(): SpeechSupportStatus {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return {
      supported: false,
      reason: 'สภาพแวดล้อมนี้ยังไม่รองรับเสียงอ่านอัตโนมัติ'
    };
  }

  return {
    supported: true,
    reason: 'รองรับเสียงอ่านอัตโนมัติ'
  };
}
