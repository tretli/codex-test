import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsLoopComponent } from './loop.details.component';

export const loopModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Loop,
  key: 'loop',
  component: IvrModuleDetailsLoopComponent,
  preferredLinkField: 'loopModuleId'
});
