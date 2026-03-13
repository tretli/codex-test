import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsAbsenceInfoComponent } from './absence-info.details.component';

export const absenceInfoModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.AbsenceInfo,
  key: 'absence-info',
  component: IvrModuleDetailsAbsenceInfoComponent,
  preferredLinkField: 'nextModuleId'
});
