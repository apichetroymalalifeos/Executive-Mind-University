import type { DecisionEntry } from '../domain/entities/appData';
import { DecisionIntelligenceService } from '../domain/services/decisionIntelligenceService';

interface DecisionsPageProps {
  decisions: DecisionEntry[];
}

export function DecisionsPage({ decisions }: DecisionsPageProps) {
  const calibration = new DecisionIntelligenceService().calculateCalibration(decisions);

  return (
    <section className="page-stack" aria-labelledby="decisions-title">
      <div className="section-heading">
        <p className="eyebrow">ระบบฝึกการตัดสินใจ</p>
        <h2 id="decisions-title">สมุดบันทึกการตัดสินใจ</h2>
      </div>
      <div className="metric-grid">
        <div>
          <span>จำนวน decision</span>
          <strong>{decisions.length}</strong>
        </div>
        <div>
          <span>ทบทวนแล้ว</span>
          <strong>{calibration.reviewedCount}</strong>
        </div>
        <div>
          <span>อัตรากระบวนการคิดที่ดี</span>
          <strong>{Math.round(calibration.processGoodRate * 100)}%</strong>
        </div>
      </div>
      <p className="empty-note">การเพิ่ม แก้ไข ค้นหา filter tag ทบทวน และ export decision ที่เลือกไว้ จะเริ่มใน Phase 3</p>
    </section>
  );
}
