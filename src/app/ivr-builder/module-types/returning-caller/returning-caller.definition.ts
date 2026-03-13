import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsReturningCallerComponent } from './returning-caller.details.component';

export const returningCallerModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.ReturningCaller,
  key: 'returning-caller',
  component: IvrModuleDetailsReturningCallerComponent,
  preferredLinkField: 'aboveThresholdModuleId'
});
