import type { FutureScenario } from '../domain/entities/appData';
import { FutureReadinessService } from '../domain/services/futureReadinessService';

interface FuturePageProps {
  scenarios: FutureScenario[];
}

export function FuturePage({ scenarios }: FuturePageProps) {
  const score = new FutureReadinessService().calculateScore({
    aiLiteracy: 50,
    adaptability: 50,
    decisionQuality: 50,
    informationLiteracy: 50,
    systemsThinking: 50,
    financialResilience: 50,
    healthCapacity: 50,
    communication: 50,
    learningConsistency: 50,
    execution: 50
  });

  return (
    <section className="page-stack" aria-labelledby="future-title">
      <div className="section-heading">
        <p className="eyebrow">เรียนรู้จากฉากทัศน์อนาคต</p>
        <h2 id="future-title">ความพร้อมสำหรับโลกอนาคต</h2>
        <p>คะแนนนี้ใช้เพื่อเลือกบทเรียนและ action ถัดไป ไม่ได้ใช้เพื่อสร้างความกังวล</p>
      </div>
      <div className="metric-grid">
        <div>
          <span>คะแนนตั้งต้น</span>
          <strong>{score.overall}</strong>
        </div>
        <div>
          <span>จำนวน scenario</span>
          <strong>{scenarios.length}</strong>
        </div>
      </div>
      <div className="faculty-list">
        {scenarios.map((scenario) => (
          <article key={scenario.id}>
            <span>{scenario.domain}</span>
            <strong>{scenario.title}</strong>
            <p>{scenario.noRegretMoves.join(', ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
