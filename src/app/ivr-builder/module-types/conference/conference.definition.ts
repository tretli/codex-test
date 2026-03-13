import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsConferenceComponent } from './conference.details.component';

export const conferenceModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Conference,
  key: 'conference',
  component: IvrModuleDetailsConferenceComponent
});
