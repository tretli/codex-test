import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsLoadComponent } from './load.details.component';

export const loadModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Load,
  key: 'load',
  component: IvrModuleDetailsLoadComponent,
  preferredLinkField: 'aModuleId'
});
