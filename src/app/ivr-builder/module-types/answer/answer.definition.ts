import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsAnswerComponent } from './answer.details.component';

export const answerModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Answer,
  key: 'answer',
  component: IvrModuleDetailsAnswerComponent,
  preferredLinkField: 'nextModuleId'
});
