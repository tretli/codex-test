import { CallModuleType, ServiceModuleReadDtmf } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsReadDtmfComponent } from './read-dtmf.details.component';

export const readDtmfModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.ReadDtmf,
  key: 'read-dtmf',
  label: 'Read DTMF',
  color: '#fb923c',
  component: IvrModuleDetailsReadDtmfComponent,
  model: {
    toServiceModule: (input) => new ServiceModuleReadDtmf(input)
  }
});
