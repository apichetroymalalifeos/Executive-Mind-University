import { Link } from 'react-router-dom';
import { DailyHabitGuide } from '../components/learning/DailyHabitGuide';
import { getPrimaryLesson } from '../content/lessons/lessonRepository';
import type { AppDataEnvelope } from '../domain/entities/appData';
import { createDailyHabitPlan } from '../domain/services/dailyHabitService';
import type { DailyLearningRecommendation } from '../domain/services/engineContracts';
import { calculateSectionProgress, getLessonProgress } from '../domain/services/learningProgressService';

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
        <h3>{activeAction?.what || lesson.recommendedApplicationArea}</h3>
        <p>{activeAction?.minimumAcceptableAction || recommendation.suggestedExercise}</p>
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
