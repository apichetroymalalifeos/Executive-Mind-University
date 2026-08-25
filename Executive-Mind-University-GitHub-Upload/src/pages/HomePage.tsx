import { Link } from 'react-router-dom';
import { DailyHabitGuide } from '../components/learning/DailyHabitGuide';
import { getPrimaryLesson } from '../content/lessons/lessonRepository';
import type { AppDataEnvelope } from '../domain/entities/appData';
import { createAppliedDecisionScorecard } from '../domain/services/appliedDecisionService';
import { createDailyHabitPlan } from '../domain/services/dailyHabitService';
import type { DailyLearningRecommendation } from '../domain/services/engineContracts';
import {
  calculateSectionProgress,
  getAppliedCompletionGate,
  getLessonProgress
} from '../domain/services/learningProgressService';

interface HomePageProps {
  data: AppDataEnvelope;
  recommendation: DailyLearningRecommendation;
}

export function HomePage({ data, recommendation }: HomePageProps) {
  const lesson = getPrimaryLesson();
  const progress = getLessonProgress(data, lesson.id);
  const completedSections = progress?.completedSectionIds ?? [];
  const progressPercentage = calculateSectionProgress(completedSections, lesson.sections.length);
  const activeAction = data.reviews.find((contract) => contract.status === 'planned' || contract.status === 'postponed');
  const latestQuizScore = data.curriculumProgress.latestQuizScore[lesson.id];
  const weakArea = Object.entries(data.curriculumProgress.weakAreas).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'ยังไม่มี';
  const currentSection = lesson.sections.find((section) => section.id === progress?.currentSectionId) ?? lesson.sections[0];
  const habitPlan = createDailyHabitPlan(data);
  const completionGate = getAppliedCompletionGate(data, lesson);
  const appliedScorecard = createAppliedDecisionScorecard(data);
  if (!currentSection) {
    return null;
  }

  return (
    <section className="page-stack" aria-labelledby="home-title">
      <div className="hero-panel compact-hero">
        <p className="eyebrow">คำตอบของวันนี้ใน 5 วินาที</p>
        <h2 id="home-title">{lesson.titleThai}</h2>
        <p>{recommendation.reason}</p>
        <div className="metric-grid">
          <div>
            <span>เวลา</span>
            <strong>{recommendation.estimatedDuration} นาที</strong>
          </div>
          <div>
            <span>ความคืบหน้า</span>
            <strong>{progressPercentage}%</strong>
          </div>
          <div>
            <span>เรียนต่อจาก</span>
            <strong>{currentSection.title}</strong>
          </div>
          <div>
            <span>เรียนต่อเนื่อง</span>
            <strong>{data.curriculumProgress.learningStreakDays} วัน</strong>
          </div>
        </div>
        <Link className="primary-action link-action" to="/today">
          {progress ? 'เรียนต่อ' : 'เริ่มเรียน'}
        </Link>
      </div>

      <section className="focus-block">
        <p className="eyebrow">งานถัดไปหนึ่งอย่าง</p>
        <h3>{completionGate.canComplete ? activeAction?.what || lesson.recommendedApplicationArea : completionGate.nextRequiredAction}</h3>
        <p>
          {completionGate.canComplete
            ? activeAction?.minimumAcceptableAction || recommendation.suggestedExercise
            : 'ระบบจะยังไม่ให้นับว่าเรียนจบ จนกว่าบทเรียนจะกลายเป็น Decision Canvas, Quiz, Action Contract และ Daily Review จริง'}
        </p>
      </section>

      <section className="completion-gate">
        <div>
          <p className="eyebrow">Daily Loop Status</p>
          <h3>{completionGate.canComplete ? 'วันนี้ปิด learning loop ได้แล้ว' : 'วันนี้ยังต้องเปลี่ยนความรู้เป็น action'}</h3>
        </div>
        <div className="gate-grid">
          {completionGate.completedRequirements.map((item) => (
            <span className="gate-pill done" key={item}>
              ผ่าน: {item}
            </span>
          ))}
          {completionGate.missingRequirements.map((item) => (
            <span className="gate-pill todo" key={item}>
              ต้องทำ: {item}
            </span>
          ))}
        </div>
      </section>

      <section className="scorecard-panel" aria-labelledby="applied-score-title">
        <div>
          <p className="eyebrow">Applied Decision Score</p>
          <h3 id="applied-score-title">{appliedScorecard.score}/100</h3>
          <p>{appliedScorecard.level}</p>
        </div>
        <div>
          <strong>จุดที่ควรทำต่อ</strong>
          <p>{appliedScorecard.nextImprovement}</p>
        </div>
      </section>

      <DailyHabitGuide plan={habitPlan} variant="compact" />

      <div className="metric-grid">
        <div>
          <span>คะแนน quiz ล่าสุด</span>
          <strong>{latestQuizScore === undefined ? 'ยังไม่ได้ทำ' : `${latestQuizScore}%`}</strong>
        </div>
        <div>
          <span>จุดที่ควรฝึกเพิ่ม</span>
          <strong>{weakArea}</strong>
        </div>
        <div>
          <span>กำหนดทบทวน</span>
          <strong>{activeAction?.reviewDate || 'ยังไม่มี'}</strong>
        </div>
        <div>
          <span>เวลาเรียนสะสม</span>
          <strong>{data.curriculumProgress.totalLearningMinutes} นาที</strong>
        </div>
      </div>
    </section>
  );
}
