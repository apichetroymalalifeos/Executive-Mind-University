import type { ActionContract, AppDataEnvelope, DailyReviewEntry, DecisionEntry } from '../domain/entities/appData';
import {
  createAppliedDecisionScorecard,
  createWeeklyAppliedReviewSummary
} from '../domain/services/appliedDecisionService';

interface ReviewPageProps {
  data: AppDataEnvelope;
  reviews: ActionContract[];
  dailyReviews: DailyReviewEntry[];
  decisions: DecisionEntry[];
}

export function ReviewPage({ data, reviews, dailyReviews, decisions }: ReviewPageProps) {
  const scorecard = createAppliedDecisionScorecard(data);
  const weeklySummary = createWeeklyAppliedReviewSummary(data);

  return (
    <section className="page-stack" aria-labelledby="review-title">
      <div className="section-heading">
        <p className="eyebrow">Reflection และ Feedback</p>
        <h2 id="review-title">ประวัติการทบทวน</h2>
        <p>รวม daily review, ผลลัพธ์ของ action และการทบทวน decision ไว้ที่นี่</p>
      </div>
      <section className="scorecard-panel" aria-labelledby="scorecard-title">
        <div>
          <p className="eyebrow">Applied Decision Scorecard</p>
          <h3 id="scorecard-title">{scorecard.score}/100</h3>
          <p>{scorecard.level}</p>
        </div>
        <div>
          <strong>Next improvement</strong>
          <p>{scorecard.nextImprovement}</p>
        </div>
      </section>
      <div className="metric-grid">
        <div>
          <span>Action Contract</span>
          <strong>{reviews.length}</strong>
        </div>
        <div>
          <span>Daily Review</span>
          <strong>{dailyReviews.length}</strong>
        </div>
        <div>
          <span>Decision ที่ทบทวนแล้ว</span>
          <strong>{decisions.filter((decision) => decision.actualOutcome !== null).length}</strong>
        </div>
      </div>
      <section className="focus-block" aria-labelledby="weekly-review-title">
        <div className="section-heading">
          <p className="eyebrow">{weeklySummary.windowLabel}</p>
          <h3 id="weekly-review-title">สรุปการนำไปใช้จริง</h3>
          <p>{weeklySummary.strongestSignal}</p>
        </div>
        <div className="metric-grid">
          <div>
            <span>Action ใหม่</span>
            <strong>{weeklySummary.actionsCreated}</strong>
          </div>
          <div>
            <span>Action เสร็จ</span>
            <strong>{weeklySummary.actionsCompleted}</strong>
          </div>
          <div>
            <span>รอทบทวนผล</span>
            <strong>{weeklySummary.actionsWaitingReview}</strong>
          </div>
          <div>
            <span>Daily Review</span>
            <strong>{weeklySummary.dailyReviewsCompleted}</strong>
          </div>
        </div>
        <p>{weeklySummary.nextReviewFocus}</p>
      </section>
      <section className="completion-gate" aria-labelledby="signal-title">
        <div>
          <p className="eyebrow">Signals</p>
          <h3 id="signal-title">สิ่งที่ระบบเห็นจากพฤติกรรมจริง</h3>
        </div>
        <div className="gate-grid">
          {scorecard.completedSignals.map((item) => (
            <span className="gate-pill done" key={item}>
              ผ่าน: {item}
            </span>
          ))}
          {scorecard.missingSignals.map((item) => (
            <span className="gate-pill todo" key={item}>
              ต้องทำ: {item}
            </span>
          ))}
        </div>
      </section>
      <div className="page-stack">
        {dailyReviews.length === 0 ? <p className="empty-note">ยังไม่มี daily review ให้เริ่มจากหน้า วันนี้ หลังเรียนบทเรียน</p> : null}
        {dailyReviews.map((review) => (
          <article key={review.id} className="focus-block">
            <p className="eyebrow">{review.status}</p>
            <h3>{review.whatDidILearn || 'รีวิวที่ยังไม่ได้ตั้งชื่อ'}</h3>
            <p>{review.whatWillIDoWithin24Hours}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
