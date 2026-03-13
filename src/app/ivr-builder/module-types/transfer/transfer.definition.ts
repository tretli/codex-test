import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsTransferComponent } from './transfer.details.component';

export const transferModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Transfer,
  key: 'transfer',
  component: IvrModuleDetailsTransferComponent
});
