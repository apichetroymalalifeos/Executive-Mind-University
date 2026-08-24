import { Link } from 'react-router-dom';
import type { DailyHabitPlan } from '../../domain/services/dailyHabitService';
import { getSevenDayOperatingGuide } from '../../domain/services/dailyHabitService';

interface DailyHabitGuideProps {
  plan: DailyHabitPlan;
  variant?: 'full' | 'compact';
}

export function DailyHabitGuide({ plan, variant = 'full' }: DailyHabitGuideProps) {
  const guide = getSevenDayOperatingGuide();

  return (
    <section className="habit-panel" aria-labelledby="habit-title">
      <div className="habit-head">
        <div>
          <p className="eyebrow">Daily re-entry system</p>
          <h3 id="habit-title">{plan.headline}</h3>
          <p>{plan.primaryPrompt}</p>
        </div>
        <div className="habit-time">
          <span>เริ่มได้ใน</span>
          <strong>{plan.minutes} นาที</strong>
        </div>
      </div>

      <div className="habit-minimum">
        <span>Minimum action</span>
        <strong>{plan.minimumAction}</strong>
        <p>{plan.expectedOutcome}</p>
      </div>

      <div className="rhythm-row" aria-label="Daily learning rhythm">
        {plan.rhythm.map((step) => (
          <article key={step.id}>
            <span>{step.label}</span>
            <strong>{step.minutes} นาที</strong>
            <p>{step.instruction}</p>
            <small>{step.evidence}</small>
          </article>
        ))}
      </div>

      {variant === 'full' ? (
        <div className="operating-guide">
          <p className="eyebrow">วิธีใช้ให้ได้ผลลัพธ์จริง 7 วัน</p>
          <ol>
            {guide.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      ) : null}

      <Link className="primary-action link-action" to={plan.nextRoute}>
        เปิดขั้นตอนที่ควรทำตอนนี้
      </Link>
    </section>
  );
}
