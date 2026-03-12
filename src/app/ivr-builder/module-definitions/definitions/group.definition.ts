import { CallModuleType } from '../../../models/models';
import { IvrModuleDetailsGroupComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const groupModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.Group,
  key: 'group',
  canvas: {
    label: 'Group',
    color: '#c084fc',
    creatable: false
  },
  details: {
    component: IvrModuleDetailsGroupComponent,
    supportsBackendLookups: false
  }
};
