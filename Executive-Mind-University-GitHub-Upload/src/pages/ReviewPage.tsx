import type { ActionContract, DailyReviewEntry, DecisionEntry } from '../domain/entities/appData';

interface ReviewPageProps {
  reviews: ActionContract[];
  dailyReviews: DailyReviewEntry[];
  decisions: DecisionEntry[];
}

export function ReviewPage({ reviews, dailyReviews, decisions }: ReviewPageProps) {
  return (
    <section className="page-stack" aria-labelledby="review-title">
      <div className="section-heading">
        <p className="eyebrow">Reflection และ Feedback</p>
        <h2 id="review-title">ประวัติการทบทวน</h2>
        <p>รวม daily review, ผลลัพธ์ของ action และการทบทวน decision ไว้ที่นี่</p>
      </div>
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
