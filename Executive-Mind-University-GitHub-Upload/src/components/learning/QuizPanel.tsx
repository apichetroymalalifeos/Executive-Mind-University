import { useState } from 'react';
import type { QuizAttempt, QuizQuestion } from '../../domain/entities/appData';
import { scoreQuiz } from '../../domain/services/learningProgressService';

interface QuizPanelProps {
  lessonId: string;
  questions: QuizQuestion[];
  attempts: QuizAttempt[];
  onSubmit: (answers: Record<string, string>) => void;
}

export function QuizPanel({ lessonId, questions, attempts, onSubmit }: QuizPanelProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const lessonAttempts = attempts.filter((attempt) => attempt.lessonId === lessonId);
  const latestAttempt = lessonAttempts[lessonAttempts.length - 1] ?? null;
  const preview = submitted ? scoreQuiz(questions, answers) : null;

  function setAnswer(questionId: string, value: string): void {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function submit(): void {
    onSubmit(answers);
    setSubmitted(true);
  }

  return (
    <section className="focus-block" aria-labelledby="quiz-title">
      <div className="section-heading">
        <p className="eyebrow">Quiz</p>
        <h3 id="quiz-title">Quiz บทที่ 1</h3>
        <p>คะแนนล่าสุด: {latestAttempt ? `${latestAttempt.score}%` : 'ยังไม่ได้ทำ'}</p>
      </div>
      <div className="quiz-stack">
        {questions.map((question, index) => (
          <fieldset key={question.id} className="quiz-question">
            <legend>
              {index + 1}. {question.prompt}
            </legend>
            {question.options.length > 0 ? (
              question.options.map((option) => (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(event) => setAnswer(question.id, event.target.value)}
                  />
                  {option}
                </label>
              ))
            ) : (
              <textarea
                rows={4}
                value={answers[question.id] ?? ''}
                onChange={(event) => setAnswer(question.id, event.target.value)}
                placeholder="เขียน reflection ของคุณ"
              />
            )}
            {submitted ? (
              <p className="empty-note">
                {question.correctAnswerId === null
                  ? question.explanation
                  : answers[question.id] === question.correctAnswerId
                    ? `ถูกต้อง ${question.explanation}`
                    : `ควรทบทวน: ${question.explanation} คำตอบที่ถูกต้อง: ${question.correctAnswerId}`}
              </p>
            ) : null}
          </fieldset>
        ))}
      </div>
      {preview ? (
        <p className="status-note">
          คะแนน: {preview.score}% | แนวคิดที่ควรทบทวน: {preview.weakConcepts.join(', ') || 'ไม่มี'}
        </p>
      ) : null}
      <button type="button" className="primary-action" onClick={submit}>
        ส่งคำตอบ
      </button>
    </section>
  );
}
