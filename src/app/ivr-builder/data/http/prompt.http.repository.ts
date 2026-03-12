import { Injectable } from '@angular/core';
import { PromptAssetItem } from '../contracts/ivr-lookup-contracts';
import { PromptRepository } from '../repositories/prompt.repository';
import { IvrApiClient } from './ivr-api-client';

@Injectable()
export class PromptHttpRepository extends PromptRepository {
  constructor(private readonly apiClient: IvrApiClient) {
    super();
  }

  listPrompts(): Promise<PromptAssetItem[]> {
    return this.apiClient.get<PromptAssetItem[]>('/api/ivr/prompts');
  }
}
