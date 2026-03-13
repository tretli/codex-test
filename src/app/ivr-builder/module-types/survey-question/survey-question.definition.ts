import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsSurveyQuestionComponent } from './survey-question.details.component';

export const surveyQuestionModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.SurveyQuestion,
  key: 'survey-question',
  component: IvrModuleDetailsSurveyQuestionComponent,
  preferredLinkField: 'nextModuleId'
});
