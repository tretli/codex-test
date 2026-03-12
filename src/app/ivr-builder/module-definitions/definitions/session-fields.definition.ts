import { CallModuleType, ServiceModuleSessionFields } from '../../../models/models';
import { IvrModuleDetailsSessionFieldsComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const sessionFieldsModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.SessionFields,
  key: 'session-fields',
  canvas: {
    label: 'Session fields',
    color: '#a3e635',
    creatable: false
  },
  model: {
    toServiceModule: (input) => new ServiceModuleSessionFields(input)
  },
  details: {
    component: IvrModuleDetailsSessionFieldsComponent,
    supportsBackendLookups: false
  }
};
