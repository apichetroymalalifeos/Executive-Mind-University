import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const navigationItems = [
  { to: '/', label: 'หน้าแรก' },
  { to: '/today', label: 'วันนี้' },
  { to: '/curriculum', label: 'หลักสูตร' },
  { to: '/decisions', label: 'ตัดสินใจ' },
  { to: '/future', label: 'อนาคต' },
  { to: '/review', label: 'รีวิว' },
  { to: '/knowledge', label: 'ความรู้' },
  { to: '/settings', label: 'ตั้งค่า' }
];

interface AppLayoutProps {
  children: ReactNode;
  recovered: boolean;
  errors: string[];
}

export function AppLayout({ children, recovered, errors }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">ระบบเรียนรู้แบบเก็บข้อมูลในเครื่อง</p>
          <h1>Executive Mind University</h1>
        </div>
        <span className="storage-pill">executiveMindUniversity.v1</span>
      </header>

      {recovered ? (
        <section className="system-alert" role="status">
          <strong>กู้คืนด้วยค่าเริ่มต้นที่ปลอดภัยแล้ว</strong>
          <span>{errors.join(', ')}</span>
        </section>
      ) : null}

      <main className="app-content">{children}</main>

      <nav className="bottom-nav" aria-label="เมนูหลัก">
        {navigationItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
