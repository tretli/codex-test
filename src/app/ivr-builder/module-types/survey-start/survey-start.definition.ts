import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsSurveyStartComponent } from './survey-start.details.component';

export const surveyStartModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.SurveyStart,
  key: 'survey-start',
  component: IvrModuleDetailsSurveyStartComponent,
  preferredLinkField: 'nextModuleId'
});
