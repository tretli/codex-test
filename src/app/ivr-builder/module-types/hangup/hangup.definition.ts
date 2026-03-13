import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsHangupComponent } from './hangup.details.component';

export const hangupModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Hangup,
  key: 'hangup',
  label: 'Hangup',
  color: '#64748b',
  component: IvrModuleDetailsHangupComponent,
  creatable: true,
  defaultName: 'Hangup',
  preferredLinkField: 'nextModuleId',
  createDefaults: () => ({ cause: 'normal' })
});
