import { CallModuleType, ServiceModuleInfo } from '../../../models/models';
import { IvrModuleDetailsInfoComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const playSoundModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.Info,
  key: 'play-sound',
  canvas: {
    label: 'PlaySound',
    color: '#ef4444',
    creatable: true,
    defaultName: 'Playback',
    preferredLinkField: 'nextModuleId',
    createDefaults: () => ({
      answer: true,
      background: false,
      soundFile: '',
      nextModuleId: 0
    })
  },
  model: {
    toServiceModule: (input) => new ServiceModuleInfo(input)
  },
  details: {
    component: IvrModuleDetailsInfoComponent,
    supportsBackendLookups: true
  }
};
