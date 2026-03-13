import { CallModuleType, ServiceModuleInfo } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsPlaySoundComponent } from './play-sound.details.component';

export const playSoundModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Info,
  key: 'play-sound',
  label: 'PlaySound',
  color: '#ef4444',
  component: IvrModuleDetailsPlaySoundComponent,
  creatable: true,
  defaultName: 'Playback',
  preferredLinkField: 'nextModuleId',
  createDefaults: () => ({
    answer: true,
    background: false,
    soundFile: '',
    nextModuleId: 0
  }),
  model: {
    toServiceModule: (input) => new ServiceModuleInfo(input)
  },
  supportsBackendLookups: true
});
