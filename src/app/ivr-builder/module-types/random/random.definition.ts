import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsRandomComponent } from './random.details.component';

export const randomModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Random,
  key: 'random',
  component: IvrModuleDetailsRandomComponent,
  preferredLinkField: 'aModuleId'
});
