# Assumptions and Risks

## Safe Assumptions

- Phase 1 ต้องสร้าง foundation เท่านั้น ยังไม่สร้าง Lesson 1 หรือ feature ครบทั้งระบบ
- โปรเจกต์ใหม่อยู่ที่ `executive-mind-university` และไม่ใช่ Life OS
- MVP ใช้ `localStorage` ผ่าน abstraction ก่อน เพราะข้อมูล Phase 1 ยังเล็ก
- ไม่มี backend, login, cloud database หรือ paid API
- ข้อมูล health, finance และ investing ในอนาคตต้องมี uncertainty และ risk note

## Risks

- `localStorage` มีขนาดจำกัด ต้องวาง repository interface เพื่อย้ายไป IndexedDB ได้
- Import JSON ที่ไม่ดีอาจทำลายข้อมูลเดิม จึงต้อง preview, validate, dry-run และไม่ commit ถ้า invalid
- Knowledge updates อาจทำให้เนื้อหาไม่น่าเชื่อถือถ้า publish อัตโนมัติ จึงต้อง draft และ human approval
- Audio mode มีความเสี่ยงระหว่างขับรถ ต้องมี warning และ controls ใหญ่ใน Phase 2
- Product อาจกลายเป็น feature-heavy ถ้าไม่ยึด North Star Metric

## Current Workspace Check

- Current directory: `C:\Users\apich\Documents\Codex\2026-07-17\files-mentioned-by-the-user-codex`
- Existing files before work: `work/`, `outputs/`
- Git repository: none detected in this directory
- Life OS folder: not detected in the working directory
