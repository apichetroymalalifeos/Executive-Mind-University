import type { LessonContent } from './lessonTypes';

export const LESSON_1_ID = 'lesson-001-art-of-thinking';

export const lesson1: LessonContent = {
  id: LESSON_1_ID,
  lessonNumber: 1,
  version: 1,
  titleEnglish: 'The Art of Thinking',
  titleThai: 'วิธีคิดที่แยกคนธรรมดาออกจากผู้สร้างโลก',
  facultyId: 'first-principles-thinking',
  facultyTitle: 'First Principles Thinking',
  estimatedMinutes: 25,
  whyItMatters:
    'บทนี้เป็นฐานของงานขาย ธุรกิจ AI สุขภาพ การลงทุน และครอบครัว เพราะผลลัพธ์ระยะยาวมักเริ่มจากคุณภาพของคำถามและการตัดสินใจ ไม่ใช่จำนวนชั่วโมงที่ทำงานอย่างเดียว',
  recommendedApplicationArea:
    'เลือก decision สำคัญหนึ่งเรื่องวันนี้ แล้วใช้ Decision Canvas แยกข้อมูลจริง สมมติฐาน ความเห็น และความไม่รู้',
  learningObjectives: [
    'แยก Thinking ออกจาก Reacting',
    'เลือกปัญหาที่แท้จริง',
    'แยก Fact, Assumption และ Opinion',
    'เข้าใจ First Principles, Inversion, Second-order Effects และ Systems Thinking',
    'เปลี่ยนความรู้เป็น Action ภายใน 24 ชั่วโมง'
  ],
  sections: [
    {
      id: 'opening-question',
      title: 'Opening Question',
      estimatedMinutes: 1,
      content:
        'คำถามเปิดบทเรียนคือ วันนี้คุณกำลังคิดจริง ๆ หรือแค่ตอบสนองต่อสิ่งที่เข้ามา คนส่วนใหญ่ยุ่งมาก แต่ความยุ่งไม่ใช่หลักฐานของความก้าวหน้า ถ้าคุณตอบลูกค้าเร็ว แต่ยังไม่รู้ว่าลูกค้าตัดสินใจจากอะไร คุณอาจแค่เคลื่อนไหว ไม่ได้คิด บทนี้จะฝึกให้หยุดหนึ่งจังหวะ แล้วถามว่า ปัญหาจริงคืออะไร ข้อมูลจริงคืออะไร และ action ที่เล็กที่สุดที่ควรทำต่อคืออะไร',
      audioText:
        'คำถามเปิดบทเรียนคือ วันนี้คุณกำลังคิดจริง ๆ หรือแค่ตอบสนองต่อสิ่งที่เข้ามา ให้หยุดหนึ่งจังหวะ แล้วถามว่า ปัญหาจริงคืออะไร ข้อมูลจริงคืออะไร และสิ่งที่ต้องทำต่อคืออะไร',
      keyTakeaway: 'ความเร็วมีประโยชน์เมื่อคุณเลือกปัญหาถูกก่อน'
    },
    {
      id: 'thinking-vs-reacting',
      title: 'Thinking vs Reacting',
      estimatedMinutes: 2,
      content:
        'Reacting คือการตอบสนองทันทีจากอารมณ์ ความกดดัน หรือเสียงรบกวน เช่น ลูกค้าขอตัวถูกกว่าแล้วรีบลดราคา Thinking คือการหยุดตรวจว่าเขาต้องการราคาถูกจริง หรือกลัวความเสี่ยงเรื่องคุณภาพ ระยะส่งมอบ หรือการอนุมัติจากหัวหน้า Fact คือสิ่งที่ตรวจสอบได้ Interpretation คือการตีความ Application คือการเลือกคำถามถัดไป Limitation คือบางสถานการณ์ต้องตัดสินใจเร็ว แต่เร็วไม่ควรแปลว่าสุ่ม',
      audioText:
        'Reacting คือการตอบทันทีจากแรงกดดัน Thinking คือการหยุดตรวจว่าเกิดอะไรจริง ลูกค้าขอถูกกว่าอาจไม่ได้ต้องการถูกที่สุด แต่อาจกลัวความเสี่ยงที่ยังไม่ได้พูดออกมา',
      keyTakeaway: 'อย่าตอบสนองต่อคำขอแรกก่อนเข้าใจแรงจูงใจจริง'
    },
    {
      id: 'choosing-real-problem',
      title: 'Choosing the Real Problem',
      estimatedMinutes: 2,
      content:
        'คนทั่วไปแก้ปัญหาที่อยู่ตรงหน้า ผู้สร้างระบบเลือกปัญหาที่เมื่อแก้แล้วทำให้ปัญหาอื่นง่ายลง ในธุรกิจหนังและวัสดุ คำถามอาจไม่ใช่ “จะขายรุ่นไหนดี” แต่อาจเป็น “ลูกค้ากำลังลดความเสี่ยงของโปรเจกต์แบบไหน” ใน AI Business คำถามอาจไม่ใช่ “เพิ่มฟีเจอร์อะไร” แต่เป็น “งานซ้ำใดที่ถ้าแก้แล้วทีมขายประหยัดเวลาทุกสัปดาห์”',
      audioText:
        'เลือกปัญหาจริงก่อนแก้ปัญหา ปัญหาที่ดีคือปัญหาที่เมื่อแก้แล้วทำให้เรื่องอื่นง่ายขึ้น ไม่ใช่แค่ทำให้เรารู้สึกว่ายุ่งขึ้น',
      keyTakeaway: 'ปัญหาที่เลือกสำคัญพอ ๆ กับวิธีแก้'
    },
    {
      id: 'fact-assumption-opinion',
      title: 'Fact vs Assumption vs Opinion',
      estimatedMinutes: 2,
      content:
        'Fact คือข้อมูลที่ตรวจได้ เช่น ลูกค้าระบุพื้นที่ใช้งาน วันที่ต้องส่ง หรือมาตรฐานกันไฟที่ต้องใช้ Assumption คือสิ่งที่คุณคิดว่าน่าจะจริงแต่ยังไม่ยืนยัน เช่น ลูกค้ามีงบจำกัด Opinion คือความเห็น เช่น รุ่นนี้ดูพรีเมียมกว่า Unknown คือสิ่งที่ยังไม่รู้ เช่น ผู้อนุมัติสุดท้ายให้ค่าน้ำหนักกับอะไร การแยกสี่อย่างนี้ลดความผิดพลาดจากความมั่นใจเกินหลักฐาน',
      audioText:
        'Fact ตรวจสอบได้ Assumption ยังต้องยืนยัน Opinion คือความเห็น Unknown คือสิ่งที่ยังไม่รู้ การแยกสี่อย่างนี้ทำให้ตัดสินใจนิ่งขึ้น',
      keyTakeaway: 'อย่าให้ opinion แต่งตัวเป็น fact'
    },
    {
      id: 'first-principles',
      title: 'First Principles Thinking',
      estimatedMinutes: 2,
      content:
        'First Principles คือการถอดเรื่องซับซ้อนกลับไปที่ความจริงพื้นฐาน เช่น ลูกค้าไม่ได้ซื้อหนังเพราะชื่อรุ่นเท่านั้น แต่ซื้อความทนทาน ความรู้สึกของผิวสัมผัส ความเสี่ยงที่ลดลง และความมั่นใจว่าจะผ่านการใช้งานจริง ใน AI ก็เหมือนกัน อย่าสร้างเพราะเทคโนโลยีใหม่ แต่ถามว่า input คืออะไร output ที่ต้องการคืออะไร และข้อจำกัดจริงคืออะไร',
      audioText:
        'First Principles คือถอดกลับไปที่ความจริงพื้นฐาน ลูกค้าไม่ได้ซื้อชื่อรุ่น เขาซื้อผลลัพธ์ ความเสี่ยงที่ลดลง และความมั่นใจว่าจะใช้งานได้จริง',
      keyTakeaway: 'เริ่มจากความจริงพื้นฐาน ไม่ใช่จากธรรมเนียมเดิม'
    },
    {
      id: 'inversion',
      title: 'Inversion',
      estimatedMinutes: 1,
      content:
        'Inversion คือคิดกลับด้าน แทนที่จะถามว่าจะสำเร็จได้อย่างไร ให้ถามว่าจะพลาดได้อย่างไร ดีลจะเสียเพราะอะไร แอป AI จะไม่ถูกใช้เพราะอะไร สุขภาพจะพังเพราะอะไร คำตอบมักชัดกว่า เช่น ดีลเสียเพราะส่งข้อมูลช้า ไม่รู้ผู้ตัดสินใจ หรือเสนอสินค้าเกิน requirement',
      audioText:
        'Inversion คือคิดกลับด้าน ถามว่าดีลจะเสียเพราะอะไร แอปจะไม่ถูกใช้เพราะอะไร สุขภาพจะพังเพราะอะไร แล้วป้องกันจุดนั้นก่อน',
      keyTakeaway: 'หลีกเลี่ยงความพลาดใหญ่ก่อนเพิ่มความฉลาดเล็ก'
    },
    {
      id: 'second-order-effects',
      title: 'Second-order Effects',
      estimatedMinutes: 2,
      content:
        'ผลลัพธ์ชั้นแรกคือสิ่งที่เกิดทันที ผลลัพธ์ชั้นสองคือผลที่ตามมา เช่น ลดราคาอาจปิดดีลวันนี้ แต่วางตำแหน่งแบรนด์ให้ต่อรองง่ายขึ้นในอนาคต นอนดึกอาจทำงานเพิ่มคืนนี้ แต่ลดคุณภาพการตัดสินใจพรุ่งนี้ การลงทุนตามกระแสอาจรู้สึกไม่ตกขบวน แต่เพิ่มความเสี่ยงเมื่อไม่มี thesis ชัดเจน',
      audioText:
        'คิดผลลัพธ์ชั้นสองเสมอ ลดราคาอาจชนะวันนี้แต่ทำให้แบรนด์ต่อรองง่ายขึ้น นอนดึกอาจได้งานคืนนี้แต่เสียคุณภาพวันพรุ่งนี้',
      keyTakeaway: 'การตัดสินใจดีต้องมองผลที่ตามมา ไม่ใช่แค่ผลทันที'
    },
    {
      id: 'systems-thinking',
      title: 'Systems Thinking',
      estimatedMinutes: 2,
      content:
        'Systems Thinking คือมองความสัมพันธ์ ไม่ใช่มองเหตุการณ์เดี่ยว ยอดขายไม่ใช่แค่โทรมากขึ้น แต่เกี่ยวกับ lead quality, follow-up cadence, sample readiness, CRM, ความเร็วตอบคำถาม และความน่าเชื่อถือของข้อมูล สุขภาพก็ไม่ใช่แค่ออกกำลังกาย แต่เกี่ยวกับนอน อาหาร ความเครียด และการฟื้นตัว',
      audioText:
        'Systems Thinking คือมองระบบ ไม่ใช่เหตุการณ์เดี่ยว ยอดขาย สุขภาพ และ AI ล้วนดีขึ้นเมื่อคุณแก้ feedback loop ทั้งระบบ',
      keyTakeaway: 'อย่า optimize ชิ้นเดียวจนระบบรวมแย่ลง'
    },
    {
      id: 'probabilistic-thinking',
      title: 'Probabilistic Thinking',
      estimatedMinutes: 2,
      content:
        'โลกจริงไม่ให้ความแน่นอนเสมอ Probabilistic Thinking คือคิดเป็นความน่าจะเป็น เช่น ดีลนี้มีโอกาสปิด 60% ถ้าส่ง sample ภายในวันนี้อาจเพิ่มเป็น 75% การลงทุนก็ต้องแยก thesis, evidence, price, probability และ emotion ไม่มีคำแนะนำลงทุนใดแน่นอน 100% ต้องกำหนดความเสี่ยงก่อนเสมอ',
      audioText:
        'คิดเป็นความน่าจะเป็น ไม่ใช่ถูกหรือผิดแบบสุดขั้ว ดีล การลงทุน และธุรกิจล้วนต้องประเมินโอกาส ความเสี่ยง และข้อมูลใหม่',
      keyTakeaway: 'ความไม่แน่นอนเป็นเหตุผลให้คิดเป็นช่วงความน่าจะเป็น'
    },
    {
      id: 'feedback-loops',
      title: 'Feedback Loops',
      estimatedMinutes: 1,
      content:
        'Feedback Loop คือวงจรเรียนรู้จากผลจริง คุณบันทึกเหตุผลก่อนตัดสินใจ แล้วกลับมาดูผลภายหลัง จุดสำคัญคืออย่าตัดสินคุณภาพ decision จาก outcome อย่างเดียว บางครั้ง process ดีแต่ผลแย่เพราะโชค บางครั้ง process แย่แต่ผลดีเพราะบังเอิญ',
      audioText:
        'บันทึกเหตุผลก่อนตัดสินใจ แล้วกลับมาทบทวนผลจริง อย่าตัดสินคุณภาพ decision จาก outcome อย่างเดียว',
      keyTakeaway: 'Decision Journal ทำให้คุณเรียนรู้จากตัวเองอย่างเป็นระบบ'
    },
    {
      id: 'sales-application',
      title: 'Sales Application',
      estimatedMinutes: 1,
      content:
        'ในการขาย B2B ให้เริ่มจาก requirement จริง ผู้เกี่ยวข้อง ความเสี่ยงของโปรเจกต์ และเกณฑ์อนุมัติ ก่อนเสนอสินค้า ถ้าลูกค้าถามราคา ให้ตอบได้ แต่ควรถามต่อว่าเขาเทียบจากอะไร ใช้พื้นที่ไหน และอะไรคือ failure ที่รับไม่ได้',
      audioText:
        'ในการขาย ให้หา requirement จริง ผู้เกี่ยวข้อง และความเสี่ยงของโปรเจกต์ก่อนเสนอสินค้า ราคาเป็นข้อมูลหนึ่ง ไม่ใช่ทั้ง decision',
      keyTakeaway: 'ขายแบบคิดคือช่วยลูกค้าลดความเสี่ยง ไม่ใช่แค่ส่งราคา'
    },
    {
      id: 'ai-business-application',
      title: 'AI Business Application',
      estimatedMinutes: 1,
      content:
        'สำหรับ AI Business ให้เริ่มจาก workflow ที่เจ็บจริงและทำซ้ำบ่อย เช่น ตอบคำถามสเปก สรุปลูกค้า ทำ follow-up หรือค้นข้อมูลสินค้า อย่าเริ่มจากฟีเจอร์ที่ดูฉลาดแต่ไม่มีคนใช้ ตรวจเสมอว่า AI ลดเวลา ลด error หรือเพิ่มคุณภาพการตัดสินใจจริงหรือไม่',
      audioText:
        'AI ที่ดีต้องแก้ workflow จริง ลดเวลา ลด error หรือเพิ่มคุณภาพ decision ไม่ใช่แค่ดูฉลาดใน demo',
      keyTakeaway: 'AI ต้องผูกกับงานจริง ไม่ใช่กระแส'
    },
    {
      id: 'health-application',
      title: 'Health Application',
      estimatedMinutes: 1,
      content:
        'ด้านสุขภาพ ให้แยกข้อมูลวัดได้ อาการ ความเชื่อ และคำโฆษณา การนอน การฟื้นตัว และอาหารเป็นระบบ ไม่ใช่เรื่องแรงใจอย่างเดียว Risk note: เนื้อหานี้เป็นหลักคิดทั่วไป ไม่ใช่คำแนะนำแพทย์ โดยเฉพาะเมื่อมีโรคประจำตัวควรยึดแพทย์และผลตรวจจริง',
      audioText:
        'ด้านสุขภาพ ให้แยกข้อมูลวัดได้ อาการ ความเชื่อ และคำโฆษณา เนื้อหานี้ไม่แทนคำแนะนำแพทย์',
      keyTakeaway: 'สุขภาพต้องใช้ระบบและหลักฐาน ไม่ใช่แรงใจอย่างเดียว'
    },
    {
      id: 'investing-application',
      title: 'Investing Application',
      estimatedMinutes: 1,
      content:
        'ด้านการลงทุน ให้บันทึก thesis ก่อนซื้อ แยก evidence, price, probability และ emotion Risk note: การลงทุนมีความเสี่ยง ข้อมูลใหม่ทำให้ thesis เปลี่ยนได้ ห้ามสรุปจากกระแสหรือความมั่นใจส่วนตัวโดยไม่มีแผนจัดการ downside',
      audioText:
        'ด้านการลงทุน ให้แยก thesis, evidence, price, probability และ emotion การลงทุนมีความเสี่ยง และข้อมูลใหม่อาจเปลี่ยน thesis ได้',
      keyTakeaway: 'เขียนเหตุผลก่อนลงทุน เพื่อลด hindsight bias ตอนทบทวน'
    },
    {
      id: 'family-leadership-application',
      title: 'Family and Leadership Application',
      estimatedMinutes: 1,
      content:
        'ในครอบครัวและ leadership การคิดเริ่มจากฟังก่อนตอบ แยกพฤติกรรมออกจากตัวบุคคล และมองผลระยะยาวของคำพูด บางครั้งการชนะบทสนทนาทำให้แพ้ความสัมพันธ์ การคิดที่ดีจึงรวม empathy และ timing ไม่ใช่เหตุผลแข็งอย่างเดียว',
      audioText:
        'ในครอบครัวและ leadership ให้ฟังก่อนตอบ แยกพฤติกรรมออกจากตัวบุคคล และคิดผลระยะยาวของคำพูด',
      keyTakeaway: 'เหตุผลที่ดีต้องมี timing และ empathy'
    },
    {
      id: 'daily-exercise',
      title: 'Daily Exercise',
      estimatedMinutes: 2,
      content:
        'แบบฝึกหัดวันนี้คือ Decision Canvas เลือกหนึ่ง decision จริงที่ต้องทำภายใน 24 ชั่วโมง แล้วกรอกปัญหาจริง ผลลัพธ์ที่ต้องการ facts assumptions opinions unknowns options risks และ next action ไม่ต้องกรอกให้สมบูรณ์ตั้งแต่แรก เป้าหมายคือทำให้ความคิดชัดขึ้นพอที่จะลงมืออย่างมีหลักฐาน',
      audioText:
        'เลือกหนึ่ง decision จริง แล้วกรอก Decision Canvas ไม่ต้องสมบูรณ์ เป้าหมายคือแยกข้อมูลให้ชัดพอที่จะลงมือภายใน 24 ชั่วโมง',
      keyTakeaway: 'การคิดดีขึ้นเมื่อเขียน decision ให้ตรวจสอบได้'
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      estimatedMinutes: 1,
      content:
        'สรุปบทนี้: หนึ่ง หยุด reacting ก่อนตัดสินใจ สอง เลือกปัญหาจริง สาม แยก fact assumption opinion unknown สี่ ใช้ first principles และ inversion ห้า มองผลชั้นสอง หก บันทึก decision และกลับมาทบทวนผลจริง',
      audioText:
        'สรุปคือ หยุด reacting เลือกปัญหาจริง แยกข้อมูล ใช้ first principles มองผลชั้นสอง แล้วบันทึก decision เพื่อกลับมาทบทวน',
      keyTakeaway: 'วิธีคิดคือระบบผลิตผลลัพธ์ ไม่ใช่ทฤษฎีลอย ๆ'
    },
    {
      id: 'next-action',
      title: 'Next Action',
      estimatedMinutes: 1,
      content:
        'Next Action: เปิด Decision Canvas และกรอกอย่างน้อย 5 ช่อง ได้แก่ decision title, real problem, facts, assumptions และ next action within 24 hours จากนั้นสร้าง Action Contract หนึ่งข้อที่เล็กพอจะทำได้จริงวันนี้',
      audioText:
        'Next Action คือกรอก Decision Canvas อย่างน้อย 5 ช่อง แล้วสร้าง Action Contract หนึ่งข้อที่ทำได้จริงวันนี้',
      keyTakeaway: 'จบบทเรียนด้วย action ที่ตรวจได้ภายใน 24 ชั่วโมง'
    }
  ],
  quiz: [
    {
      id: 'q1-fact-assumption',
      type: 'multiple_choice',
      prompt: 'ข้อใดเป็น Fact ในการขายวัสดุให้ลูกค้าโรงแรม',
      options: [
        'ลูกค้าต้องชอบรุ่นแพงที่สุด',
        'ลูกค้าระบุว่าต้องใช้วัสดุกันไฟตามมาตรฐาน',
        'รุ่นนี้ดูดีที่สุด',
        'คู่แข่งน่าจะเสนอถูกกว่า'
      ],
      correctAnswerId: 'ลูกค้าระบุว่าต้องใช้วัสดุกันไฟตามมาตรฐาน',
      explanation: 'Fact คือข้อมูลที่ตรวจสอบได้ ส่วนความชอบและการคาดเดาคู่แข่งเป็น assumption หรือ opinion',
      weakConcept: 'Fact vs Assumption'
    },
    {
      id: 'q2-first-principles',
      type: 'multiple_choice',
      prompt: 'First Principles Thinking เริ่มจากอะไร',
      options: [
        'เลียนแบบคู่แข่ง',
        'เริ่มจาก trend ใหม่',
        'ถอดกลับไปที่ความจริงพื้นฐานและข้อจำกัดจริง',
        'เลือกวิธีที่เร็วที่สุดเสมอ'
      ],
      correctAnswerId: 'ถอดกลับไปที่ความจริงพื้นฐานและข้อจำกัดจริง',
      explanation: 'First principles คือการกลับไปที่ความจริงพื้นฐานก่อนสร้างทางเลือก',
      weakConcept: 'First Principles'
    },
    {
      id: 'q3-second-order',
      type: 'multiple_choice',
      prompt: 'ตัวอย่างใดคือ Second-order Effect',
      options: [
        'ลดราคาแล้วลูกค้าตอบกลับทันที',
        'ลดราคาแล้วลูกค้าจำว่าต่อรองได้ง่ายในดีลถัดไป',
        'ส่งใบเสนอราคา',
        'โทรหาลูกค้า'
      ],
      correctAnswerId: 'ลดราคาแล้วลูกค้าจำว่าต่อรองได้ง่ายในดีลถัดไป',
      explanation: 'Second-order effect คือผลที่ตามมาหลังผลทันที',
      weakConcept: 'Second-order Effects'
    },
    {
      id: 'q4-scenario',
      type: 'scenario',
      prompt: 'ลูกค้าบอกว่าสินค้าแพงเกินไป คุณควรทำอะไรก่อนลดราคา',
      options: [
        'ลดทันทีเพื่อรักษาดีล',
        'ถามว่าเขาเทียบกับอะไรและกังวลเรื่องราคา คุณภาพ หรือความเสี่ยงใด',
        'เปลี่ยนเรื่อง',
        'บอกว่าคู่แข่งคุณภาพต่ำกว่าเสมอ'
      ],
      correctAnswerId: 'ถามว่าเขาเทียบกับอะไรและกังวลเรื่องราคา คุณภาพ หรือความเสี่ยงใด',
      explanation: 'ต้องแยกปัญหาจริงก่อนตอบสนองต่อคำขอแรก',
      weakConcept: 'Decision under uncertainty'
    },
    {
      id: 'q5-reflection',
      type: 'reflection',
      prompt: 'Reflection: วันนี้คุณจะใช้ Fact / Assumption / Opinion กับ decision เรื่องใด',
      options: [],
      correctAnswerId: null,
      explanation: 'คำถาม reflection ไม่มีคำตอบเดียว เป้าหมายคือเชื่อมบทเรียนกับสถานการณ์จริง',
      weakConcept: 'Real-life application'
    }
  ]
};
