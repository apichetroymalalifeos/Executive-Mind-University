import type { KnowledgeSource, LessonRevision, SourceCredibilityTier } from '../entities/appData';
import type { KnowledgeUpdateEngine } from './engineContracts';

const allowedPrimaryEvidenceTiers: SourceCredibilityTier[] = ['A', 'B', 'C'];

export class KnowledgeUpdateService implements KnowledgeUpdateEngine {
  canUseAsPrimaryEvidence(source: KnowledgeSource): boolean {
    return source.credibilityTier !== 'D' && allowedPrimaryEvidenceTiers.includes(source.credibilityTier);
  }

  canPublishRevision(revision: LessonRevision, sources: KnowledgeSource[]): boolean {
    if (revision.reviewStatus !== 'approved' || revision.approvedAt === null) {
      return false;
    }

    const referencedSources = sources.filter((source) => revision.sourceIds.includes(source.id));
    if (referencedSources.length === 0) {
      return false;
    }

    return referencedSources.every((source) => source.status === 'approved' && source.credibilityTier !== 'D');
  }
}
