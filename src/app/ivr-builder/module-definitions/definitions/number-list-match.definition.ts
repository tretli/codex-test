import { CallModuleType, ServiceModuleNumberListMatch } from '../../../models/models';
import { IvrModuleDetailsNumberListMatchComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const numberListMatchModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.NumberListMatch,
  key: 'number-list-match',
  canvas: {
    label: 'Number list match',
    color: '#86efac',
    creatable: false
  },
  model: {
    toServiceModule: (input) => new ServiceModuleNumberListMatch(input)
  },
  details: {
    component: IvrModuleDetailsNumberListMatchComponent,
    supportsBackendLookups: false
  }
};
