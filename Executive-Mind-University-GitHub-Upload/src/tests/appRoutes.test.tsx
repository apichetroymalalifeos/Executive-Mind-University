import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../app/App';

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}

describe('main routes', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders Home route', () => {
    renderRoute('/');

    expect(screen.getByText('Executive Mind University')).toBeInTheDocument();
    expect(screen.getByText(/คำตอบของวันนี้/)).toBeInTheDocument();
    expect(screen.getByText('Daily re-entry system')).toBeInTheDocument();
  });

  it('renders Today route', () => {
    renderRoute('/today');

    expect(screen.getByText('ตัวอ่านบทเรียน')).toBeInTheDocument();
    expect(screen.getByText('Decision Canvas')).toBeInTheDocument();
    expect(screen.getByText('Quiz บทที่ 1')).toBeInTheDocument();
    expect(screen.getByText('วิธีใช้ให้ได้ผลลัพธ์จริง 7 วัน')).toBeInTheDocument();
  });

  it('renders Curriculum route', () => {
    renderRoute('/curriculum');

    expect(screen.getByText('ระบบหลักสูตร')).toBeInTheDocument();
  });

  it('renders Decisions route', () => {
    renderRoute('/decisions');

    expect(screen.getByText('สมุดบันทึกการตัดสินใจ')).toBeInTheDocument();
  });

  it('renders Knowledge route', () => {
    renderRoute('/knowledge');

    expect(screen.getByText('ศูนย์ความรู้')).toBeInTheDocument();
  });

  it('renders Settings local data controls', () => {
    renderRoute('/settings');

    expect(screen.getByRole('heading', { name: 'ตั้งค่า' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'บันทึกข้อมูล local' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export JSON' })).toBeInTheDocument();
    expect(screen.getByText('Import JSON')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Import ข้อมูลที่ตรวจแล้ว' })).toBeDisabled();
  });
});
