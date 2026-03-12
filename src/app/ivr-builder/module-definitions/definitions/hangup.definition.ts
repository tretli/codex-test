import { CallModuleType } from '../../../models/models';
import { IvrModuleDetailsHangupComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const hangupModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.Hangup,
  key: 'hangup',
  canvas: {
    label: 'Hangup',
    color: '#64748b',
    creatable: true,
    defaultName: 'Hangup',
    preferredLinkField: 'nextModuleId',
    createDefaults: () => ({ cause: 'normal' })
  },
  details: {
    component: IvrModuleDetailsHangupComponent,
    supportsBackendLookups: false
  }
};
