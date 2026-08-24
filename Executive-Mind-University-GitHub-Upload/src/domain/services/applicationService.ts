import type { ActionContract } from '../entities/appData';
import type { ApplicationEngine } from './engineContracts';
import { createId } from '../../utils/createId';

type ActionContractInput = Omit<
  ActionContract,
  'id' | 'completedAt' | 'status' | 'outcomeReview' | 'updatedAt'
> &
  Partial<Pick<ActionContract, 'status' | 'outcomeReview'>>;

export class ApplicationService implements ApplicationEngine {
  createActionContract(input: ActionContractInput): ActionContract {
    return {
      ...input,
      id: createId('action'),
      status: input.status ?? 'planned',
      completedAt: null,
      outcomeReview: input.outcomeReview ?? null,
      updatedAt: new Date().toISOString()
    };
  }

  reduceFriction(contract: ActionContract): ActionContract {
    return {
      ...contract,
      minimumAcceptableAction:
        contract.minimumAcceptableAction.trim() || 'ทำเวอร์ชันเล็กที่สุดภายใน 5 นาที'
    };
  }
}
