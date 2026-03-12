import { Injectable } from '@angular/core';
import { PromptAssetItem } from '../contracts/ivr-lookup-contracts';
import { PROMPT_FIXTURES } from './fixtures/prompt.fixtures';
import { PromptRepository } from '../repositories/prompt.repository';

@Injectable()
export class PromptMockRepository extends PromptRepository {
  async listPrompts(): Promise<PromptAssetItem[]> {
    return PROMPT_FIXTURES.map((item) => ({ ...item }));
  }
}
