import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsVoicemailComponent } from './voicemail.details.component';

export const voicemailModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Voicemail,
  key: 'voicemail',
  component: IvrModuleDetailsVoicemailComponent
});
