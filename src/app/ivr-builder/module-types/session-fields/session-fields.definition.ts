import { CallModuleType, ServiceModuleSessionFields } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsSessionFieldsComponent } from './session-fields.details.component';

export const sessionFieldsModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.SessionFields,
  key: 'session-fields',
  label: 'Session fields',
  color: '#a3e635',
  component: IvrModuleDetailsSessionFieldsComponent,
  model: {
    toServiceModule: (input) => new ServiceModuleSessionFields(input)
  }
});
