import { useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { HomePage } from '../pages/HomePage';
import { TodayPage } from '../pages/TodayPage';
import { CurriculumPage } from '../pages/CurriculumPage';
import { DecisionsPage } from '../pages/DecisionsPage';
import { FuturePage } from '../pages/FuturePage';
import { ReviewPage } from '../pages/ReviewPage';
import { KnowledgePage } from '../pages/KnowledgePage';
import { SettingsPage } from '../pages/SettingsPage';
import type { AppDataEnvelope } from '../domain/entities/appData';
import { DailyLearningService } from '../domain/services/dailyLearningService';
import { BrowserLocalStorageDriver } from '../infrastructure/storage/storageDriver';
import { LocalAppDataRepository } from '../infrastructure/storage/appDataRepository';

export function App() {
  const repository = useMemo(
    () => new LocalAppDataRepository(new BrowserLocalStorageDriver()),
    []
  );
  const initialLoad = useMemo(() => repository.load(), [repository]);
  const [data, setData] = useState<AppDataEnvelope>(initialLoad.data);
  const recommendation = useMemo(() => new DailyLearningService().recommend(data), [data]);

  function saveData(nextData: AppDataEnvelope): void {
    repository.save(nextData);
    setData(nextData);
  }

  return (
    <ErrorBoundary>
      <AppLayout recovered={initialLoad.recovered} errors={initialLoad.errors}>
        <Routes>
          <Route path="/" element={<HomePage data={data} recommendation={recommendation} />} />
          <Route path="/today" element={<TodayPage data={data} onSave={saveData} />} />
          <Route path="/curriculum" element={<CurriculumPage progress={data.curriculumProgress} />} />
          <Route path="/decisions" element={<DecisionsPage decisions={data.decisions} />} />
          <Route path="/future" element={<FuturePage scenarios={data.futureScenarios} />} />
          <Route
            path="/review"
            element={<ReviewPage reviews={data.reviews} dailyReviews={data.dailyReviews} decisions={data.decisions} />}
          />
          <Route
            path="/knowledge"
            element={<KnowledgePage sources={data.knowledgeSources} revisions={data.lessonRevisions} />}
          />
          <Route path="/settings" element={<SettingsPage data={data} onSave={saveData} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </ErrorBoundary>
  );
}
