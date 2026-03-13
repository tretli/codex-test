import { CallModuleType, ServiceModuleQueue } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsQueueComponent } from './queue.details.component';

export const queueModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Queue,
  key: 'queue',
  label: 'Queue',
  color: '#eab308',
  component: IvrModuleDetailsQueueComponent,
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
  }),
  model: {
    toServiceModule: (input) => new ServiceModuleQueue(input)
  },
  supportsBackendLookups: true
});
