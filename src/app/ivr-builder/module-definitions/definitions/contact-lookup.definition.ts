import { CallModuleType, ServiceModuleContactLookup } from '../../../models/models';
import { IvrModuleDetailsContactLookupComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const contactLookupModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.ContactLookup,
  key: 'contact-lookup',
  canvas: {
    label: 'Contact lookup',
    color: '#4338ca',
    creatable: false
  },
  model: {
    toServiceModule: (input) => new ServiceModuleContactLookup(input)
  },
  details: {
    component: IvrModuleDetailsContactLookupComponent,
    supportsBackendLookups: true
  }
};
