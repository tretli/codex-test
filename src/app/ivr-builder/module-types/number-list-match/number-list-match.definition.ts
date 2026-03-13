import { CallModuleType, ServiceModuleNumberListMatch } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsNumberListMatchComponent } from './number-list-match.details.component';

export const numberListMatchModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.NumberListMatch,
  key: 'number-list-match',
  label: 'Number list match',
  color: '#86efac',
  component: IvrModuleDetailsNumberListMatchComponent,
  model: {
    toServiceModule: (input) => new ServiceModuleNumberListMatch(input)
  }
});
