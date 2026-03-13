import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsBankIdComponent } from './bank-id.details.component';

export const bankIdModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.BankId,
  key: 'bank-id',
  component: IvrModuleDetailsBankIdComponent,
  preferredLinkField: 'successModuleId'
});
