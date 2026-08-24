import type { AppDataEnvelope, ActionContract, DailyReviewEntry } from '../entities/appData';

export interface DailyHabitPlan {
  reentryMode: 'start' | 'continue' | 'review' | 'recover';
  headline: string;
  primaryPrompt: string;
  minimumAction: string;
  expectedOutcome: string;
  nextRoute: '/today' | '/review' | '/decisions';
  minutes: number;
  frictionLevel: 'low' | 'normal' | 'high';
  rhythm: DailyRhythmStep[];
}

export interface DailyRhythmStep {
  id: string;
  label: string;
  minutes: number;
  instruction: string;
  evidence: string;
}

export function createDailyHabitPlan(data: AppDataEnvelope, now = new Date()): DailyHabitPlan {
  const today = getLocalDateKey(now);
  const hasStudiedToday = data.curriculumProgress.lastLearningDate === today;
  const activeAction = findActiveAction(data.reviews);
  const unfinishedReview = findUnfinishedReview(data.dailyReviews);
  const frictionLevel = getFrictionLevel(data);

  if (!hasStudiedToday && data.curriculumProgress.lastLearningDate !== null) {
    const daysAway = daysBetween(data.curriculumProgress.lastLearningDate, today);
    if (daysAway > 1) {
      return buildPlan({
        reentryMode: 'recover',
        headline: 'กลับมาแบบเบาที่สุดก่อน',
        primaryPrompt: 'เปิดบทเรียนเดิม อ่านหรือฟัง 1 section แล้วจด action เล็กที่สุดหนึ่งอย่าง',
        minimumAction: 'กดเรียนต่อ 3 นาที แล้วบันทึกสิ่งที่จะทำภายใน 24 ชั่วโมง',
        expectedOutcome: 'กลับเข้าสู่จังหวะเรียนโดยไม่ต้องชดเชยวันที่หายไป',
        nextRoute: '/today',
        minutes: 3,
        frictionLevel
      });
    }
  }

  if (activeAction) {
    return buildPlan({
      reentryMode: 'review',
      headline: 'วันนี้ต้องทำให้ความรู้กลายเป็นผลลัพธ์',
      primaryPrompt: activeAction.what,
      minimumAction: activeAction.minimumAcceptableAction,
      expectedOutcome: `มีหลักฐานว่าได้ลงมือ: ${activeAction.evidenceOfCompletion}`,
      nextRoute: '/review',
      minutes: 5,
      frictionLevel
    });
  }

  if (unfinishedReview) {
    return buildPlan({
      reentryMode: 'review',
      headline: 'ปิด loop ด้วยการทบทวนสั้น ๆ',
      primaryPrompt: 'ทบทวนว่าเรียนอะไร ใช้ตรงไหน และ decision ไหนชัดขึ้น',
      minimumAction: unfinishedReview.whatWillIDoWithin24Hours || 'เขียน reflection ให้ครบหนึ่งบรรทัด',
      expectedOutcome: 'ได้ feedback จริงเพื่อปรับ weak area และ action ถัดไป',
      nextRoute: '/review',
      minutes: 4,
      frictionLevel
    });
  }

  if (hasStudiedToday) {
    return buildPlan({
      reentryMode: 'continue',
      headline: 'วันนี้แตะระบบแล้ว เหลือแค่ต่อยอดหนึ่งก้าว',
      primaryPrompt: 'เลือก section ต่อไปหรือทบทวน Decision Canvas ที่ยังไม่ครบ',
      minimumAction: 'ทำต่ออีก 5 นาที หรือจดหนึ่ง unknown ที่ต้องถามลูกค้า/ทีม',
      expectedOutcome: 'รักษา streak และมี next action ที่ชัดขึ้น',
      nextRoute: '/today',
      minutes: 5,
      frictionLevel
    });
  }

  return buildPlan({
    reentryMode: 'start',
    headline: 'เริ่มวันนี้ให้เล็กพอจนปฏิเสธยาก',
    primaryPrompt: 'อ่านหรือฟัง 1 section แล้วเลือกหนึ่งสถานการณ์จริงในชีวิตงาน',
    minimumAction: 'ทำ 3 นาที: กดเริ่มเรียน แล้วเขียน Real Problem หนึ่งบรรทัด',
    expectedOutcome: 'ได้ Applied Decision หรือ Action Contract อย่างน้อยหนึ่งชิ้น',
    nextRoute: '/today',
    minutes: frictionLevel === 'high' ? 3 : 10,
    frictionLevel
  });
}

export function getSevenDayOperatingGuide(): string[] {
  return [
    'Day 1: เริ่ม Lesson 1 และเขียน Real Problem จากงานขายหรือ AI Business หนึ่งเรื่อง',
    'Day 2: แยก Fact, Assumption, Opinion, Unknown ก่อนตัดสินใจหนึ่งเรื่อง',
    'Day 3: ทำ Quiz แล้วดู weak area เพียงหนึ่งจุด',
    'Day 4: สร้าง Action Contract ที่เล็กพอทำได้ใน 24 ชั่วโมง',
    'Day 5: ลงมือทำจริงและเก็บหลักฐานสั้น ๆ เช่น note, message, call record',
    'Day 6: Review outcome โดยแยก process quality ออกจากผลลัพธ์',
    'Day 7: เลือกหนึ่งบทเรียนที่นำไปใช้ได้จริง แล้วทำซ้ำรอบใหม่'
  ];
}

function buildPlan(input: Omit<DailyHabitPlan, 'rhythm'>): DailyHabitPlan {
  return {
    ...input,
    rhythm: [
      {
        id: 'learn',
        label: 'Learn',
        minutes: Math.min(6, input.minutes),
        instruction: 'อ่านหรือฟังเฉพาะ section ปัจจุบัน',
        evidence: 'กด mark section complete'
      },
      {
        id: 'apply',
        label: 'Apply',
        minutes: 3,
        instruction: 'โยงบทเรียนกับปัญหาจริงหนึ่งเรื่อง',
        evidence: 'กรอก Real Problem หรือ Next Action'
      },
      {
        id: 'review',
        label: 'Review',
        minutes: 2,
        instruction: 'เขียนว่าความคิดหรือ decision ไหนเปลี่ยนไป',
        evidence: 'บันทึก Daily Review หนึ่งบรรทัด'
      }
    ]
  };
}

function findActiveAction(reviews: ActionContract[]): ActionContract | null {
  return (
    reviews.find((contract) => contract.status === 'planned' || contract.status === 'postponed') ?? null
  );
}

function findUnfinishedReview(reviews: DailyReviewEntry[]): DailyReviewEntry | null {
  return reviews.find((review) => review.status === 'draft') ?? null;
}

function getFrictionLevel(data: AppDataEnvelope): DailyHabitPlan['frictionLevel'] {
  if (data.profile.energyLevel === 'low' || data.profile.recoveryStatus === 'strained') {
    return 'high';
  }
  if (data.profile.availableMinutes < 15) {
    return 'low';
  }
  return 'normal';
}

function daysBetween(previousDate: string, today: string): number {
  const previous = new Date(`${previousDate}T00:00:00`);
  const current = new Date(`${today}T00:00:00`);
  return Math.round((current.getTime() - previous.getTime()) / 86400000);
}

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
