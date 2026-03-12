import { PromptAssetItem } from '../contracts/ivr-lookup-contracts';

export abstract class PromptRepository {
  abstract listPrompts(): Promise<PromptAssetItem[]>;
}
