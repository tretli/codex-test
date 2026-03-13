import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsSurveyEndComponent } from './survey-end.details.component';

export const surveyEndModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.SurveyEnd,
  key: 'survey-end',
  component: IvrModuleDetailsSurveyEndComponent
});
