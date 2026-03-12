import { CallModuleType, ServiceModuleQueue } from '../../../models/models';
import { IvrModuleDetailsQueueComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const queueModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.Queue,
  key: 'queue',
  canvas: {
    label: 'Queue',
    color: '#eab308',
    creatable: true,
    defaultName: 'Queue',
    preferredLinkField: 'continueModuleId',
    createDefaults: () => ({
      answer: true,
      queueId: 0,
      queuePriority: 0,
      queueTimeout: 0,
      timeoutModuleId: 0,
      continueModuleId: 0,
      fullModuleId: 0
    })
  },
  model: {
    toServiceModule: (input) => new ServiceModuleQueue(input)
  },
  details: {
    component: IvrModuleDetailsQueueComponent,
    supportsBackendLookups: true
  }
};
